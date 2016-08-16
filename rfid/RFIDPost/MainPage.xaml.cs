/*
 * MIT License
 *
 * Copyright (c) 2016 David Gorelik, Wes Hampson.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

using System;
using System.Collections.ObjectModel;
using System.IO;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Windows.Devices.Enumeration;
using Windows.Devices.SerialCommunication;
using Windows.Storage.Streams;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace RFIDPost
{
    public sealed partial class MainPage : Page
    {
        // Status bar messages
        private const string StatusDeviceFind = "Enumerating serial devices...";
        private const string StatusDeviceFindComplete = "Finished searching for serial devices.";
        private const string StatusDeviceSelect = "Select a device and connect.";
        private const string StatusDeviceConnectSuccess = "Successfully connected to serial device!";
        private const string StatusDeviceWait = "Waiting for data from serial device...";
        private const string StatusDeviceDataReceived = "Data received!";
        private const string StatusDeviceDisconnect = "Device disconnected.";
        private const string StatusWebPost = "Posting to web server...";
        private const string StatusWebPostSuccess = "Data posted to web server!";

        // Default serial port and URL
        private const string DefaultURL = "http://sapient-pingpong.herokuapp.com/api/user/login";
        private const string DefaultSerialPortSearchPattern = "USB";

        // Serial settings
        private const int DeviceBaudRate = 9600;
        private const int DeviceDataBits = 8;
        private const int DeviceStopBits = (int)SerialStopBitCount.One;
        private const int DeviceParity = (int)SerialParity.None;
        private const int DeviceHandshake = (int)SerialHandshake.None;

        // Private fields
        private SerialDevice serialPort;
        private DataReader serialDataReader;
        private ObservableCollection<DeviceInformation> deviceList;
        private CancellationTokenSource readCancellationTokenSource;

        /// <summary>
        /// Initializes the main page of the application.
        /// </summary>
        public MainPage()
        {
            InitializeComponent();

            serialPort = null;
            serialDataReader = null;
            deviceList = new ObservableCollection<DeviceInformation>();
            readCancellationTokenSource = null;

            serialConnectButton.IsEnabled = false;
            serialDisconnectButton.IsEnabled = false;

            // Find available serial devices
            ListAvailablePorts();
            statusTextBlock.Text = StatusDeviceSelect;

            // Connect to default serial device and set default POST url
            SelectDefaultsAndConnect();
        }

        /// <summary>
        /// Populates the UI device list with the names of all available serial ports.
        /// </summary>
        private async void ListAvailablePorts()
        {
            statusTextBlock.Text = StatusDeviceFind;

            try {
                string devSel = SerialDevice.GetDeviceSelector();
                var dis = await DeviceInformation.FindAllAsync(devSel);

                for (int i = 0; i < dis.Count; i++) {
                    deviceList.Add(dis[i]);
                }

                serialDeviceListBoxSource.Source = deviceList;
                serialDeviceListBox.SelectedIndex = -1;
                statusTextBlock.Text = StatusDeviceFindComplete;
            } catch (Exception ex) {
                statusTextBlock.Text = ex.Message;
            }
        }

        /// <summary>
        /// Selects a serial device from the device list based on a search string,
        /// connects to the device if found, and sets the POST URL text field to
        /// the default value.
        /// </summary>
        private async void SelectDefaultsAndConnect()
        {
            Regex rgx = new Regex(DefaultSerialPortSearchPattern);
            int serialDeviceIndex = -1;
            for (int i = 0; i < deviceList.Count; i++) {
                if (rgx.IsMatch(deviceList[i].Name)) {
                    serialDeviceIndex = i;
                    break;
                }
            }

            serialDeviceListBox.SelectedIndex = serialDeviceIndex;
            urlTextBox.Text = DefaultURL;

            if (serialDeviceIndex != -1) {
                // Fire "Connect" button click action
                ConnectButtonClickAction(null, null);
            }
        }

        /// <summary>
        /// Connects to a serial device.
        /// </summary>
        /// <param name="deviceInfo">The serial device information.</param>
        private async void DeviceConnect(DeviceInformation deviceInfo)
        {
            try {
                // Open serial port
                serialPort = await SerialDevice.FromIdAsync(deviceInfo.Id);

                // Set port settings
                serialPort.ReadTimeout = TimeSpan.FromMilliseconds(1000);
                serialPort.BaudRate = DeviceBaudRate;
                serialPort.DataBits = DeviceDataBits;
                serialPort.StopBits = DeviceStopBits;
                serialPort.Parity = DeviceParity;
                serialPort.Handshake = DeviceHandshake;

                // Update UI to reflect "device connected" state
                serialConnectButton.IsEnabled = false;
                serialDisconnectButton.IsEnabled = true;
                statusTextBlock.Text = StatusDeviceConnectSuccess + " " + StatusDeviceWait;

                // Set the cancellation token source
                readCancellationTokenSource = new CancellationTokenSource();

                // Listen on device
                DeviceListen();
            } catch (Exception ex) {
                statusTextBlock.Text = ex.Message;
                serialPort = null;
                serialConnectButton.IsEnabled = true;
                serialDisconnectButton.IsEnabled = false;
            }
        }

        /// <summary>
        /// Waits for data from the serial device, then calls DeviceReadAsync()
        /// to read data.
        /// </summary>
        private async void DeviceListen()
        {
            if (serialPort == null) {
                return;
            }

            try {
                serialDataReader = new DataReader(serialPort.InputStream);
                while (true) {
                    await DeviceReadAsync(readCancellationTokenSource.Token);
                }
            } catch (Exception ex) {
                if (ex.GetType().Name != "TaskCanceledException") {
                    statusTextBlock.Text = ex.Message;
                }
            } finally {
                if (serialDataReader != null) {
                    serialDataReader.DetachStream();
                    serialDataReader = null;
                }
            }
        }

        /// <summary>
        /// Reads data from the connected serial device and posts that data to the POST URL.
        /// </summary>
        /// <param name="cancellationToken">A cancellation notification object.</param>
        /// <returns>The read operation as an async task.</returns>
        private async Task DeviceReadAsync(CancellationToken cancellationToken)
        {
            const uint ReadBufferLength = 256;

            Task<uint> loadAsyncTask;

            // Don't read if cancellation has been requested
            cancellationToken.ThrowIfCancellationRequested();

            // Don't require entire buffer to be filled for read operation to complete
            serialDataReader.InputStreamOptions = InputStreamOptions.Partial;

            // Create asynchronous task
            loadAsyncTask = serialDataReader.LoadAsync(ReadBufferLength).AsTask(cancellationToken);

            uint bytesRead = await loadAsyncTask;
            string data;
            string json;
            if (bytesRead > 0) {
                // Read data as string and trim NUM chars
                data = serialDataReader.ReadString(bytesRead).Replace("\0", string.Empty);

                // Print data to output textbox and update status bar
                serialDeviceOutputTextBox.Text += data + "\n";
                statusTextBlock.Text = StatusDeviceDataReceived + " " + StatusWebPost;

                // Wrap data as 'rfid' field in JSON object
                json = FormatJSON("rfid", data);

                // Post JSON object to URL
                PostJSONData(urlTextBox.Text, json);
            }
        }

        /// <summary>
        /// Requests the cancellation of the asynchronous read operation.
        /// </summary>
        private void CancelDeviceReadTask()
        {
            if (readCancellationTokenSource != null) {
                if (!readCancellationTokenSource.IsCancellationRequested) {
                    readCancellationTokenSource.Cancel();
                }
            }
        }

        /// <summary>
        /// Closes the connected serial device and restores the UI to the
        /// "device disconnected" state.
        /// </summary>
        private void DeviceClose()
        {
            if (serialPort != null) {
                serialPort.Dispose();
            }

            serialPort = null;
            serialDeviceOutputTextBox.Text = "";
            deviceList.Clear();
        }

        /// <summary>
        /// Posts a JSON string to the specified URL.
        /// </summary>
        /// <param name="url">The URL to post to.</param>
        /// <param name="json">The string to post.</param>
        private async void PostJSONData(string url, string json)
        {
            try {
                byte[] bytes = Encoding.ASCII.GetBytes(json);

                // Create web request
                WebRequest req = WebRequest.Create(url);
                req.Method = "POST";
                req.ContentType = "application/json";

                // Write JSON data bytes
                using (Stream reqStream = await req.GetRequestStreamAsync()) {
                    await reqStream.WriteAsync(bytes, 0, bytes.Length);
                }

                // Get web response info
                WebResponse res = await req.GetResponseAsync();
                HttpStatusCode statusCode = ((HttpWebResponse)res).StatusCode;
                string statusDesc = ((HttpWebResponse)res).StatusDescription;

                // Read web response
                using (StreamReader resStream = new StreamReader(res.GetResponseStream())) {
                    webResponseTextBox.Text = (int)statusCode + " (" + statusDesc + ")\n";
                    webResponseTextBox.Text += resStream.ReadToEnd();
                }
                statusTextBlock.Text = StatusWebPostSuccess;
            } catch (Exception ex) {
                statusTextBlock.Text = ex.Message;
                webResponseTextBox.Text = ex.Message;
            }
        }

        private async void ConnectButtonClickAction(object sender, RoutedEventArgs e)
        {
            var selection = serialDeviceListBox.SelectedItems;

            if (selection.Count < 1) {
                statusTextBlock.Text = StatusDeviceSelect;
                return;
            }

            // Connect to selected serial device
            DeviceInformation entry = (DeviceInformation)selection[0];
            DeviceConnect(entry);
        }

        private void DisconnectButtonClickAction(object sender, RoutedEventArgs e)
        {
            // Disconnect from serial device and refresh device list
            try {
                CancelDeviceReadTask();
                DeviceClose();
                statusTextBlock.Text = StatusDeviceDisconnect;
                serialConnectButton.IsEnabled = true;
                serialDisconnectButton.IsEnabled = false;
                ListAvailablePorts();
                statusTextBlock.Text = StatusDeviceSelect;
            } catch (Exception ex) {
                statusTextBlock.Text = ex.Message;
            }
        }

        private void RefreshButtonClickAction(object sender, RoutedEventArgs e)
        {
            // Clear device list and repopulate
            deviceList.Clear();
            ListAvailablePorts();
        }

        private void DeviceOutputClearButtonClickAction(object sender, RoutedEventArgs e)
        {
            serialDeviceOutputTextBox.Text = "";
        }

        private void SerialDeviceListBoxSelectionChanged(object sender, RoutedEventArgs e)
        {
            var selection = serialDeviceListBox.SelectedItems;
            serialConnectButton.IsEnabled = serialPort == null && selection.Count == 1;
            serialDisconnectButton.IsEnabled = serialPort != null;
        }

        private string FormatJSON(string key, string value)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{ ");
            sb.AppendFormat("\"{0}\": \"{1}\"", key, value);
            sb.Append(" }");

            return sb.ToString();
        }
    }
}
