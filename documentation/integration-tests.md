# OneFi Integration Tests

OneFi integration tests verify the compliance of OneFi with the current system (OS, hardware, etc.). Specifically, in OneFi the integration tests carry two major functions:

* They allow to test functionality that cannot be adequately covered by the unit tests, e.g., connection to a Wi-Fi network.
* They show how to use properly use the OneFi API.

Unlike unit tests, the OneFi integration tests are not supposed to be invoked in bulk --- we run them one-by-one and manually observe their output.

## Usage

To run an integration test, just type the following command:

`node <test>.js`

Where `<test>` is the name of the test, e.g. `ssid-test`.