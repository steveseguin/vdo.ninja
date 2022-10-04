# Updates - Speed Test

[speed-test.md](../steves-helper-apps/speed-test.md "mention")

#### October 3

* Fixed a couple issues with the speedtest and [vdo.ninja/alpha/check](https://vdo.ninja/alpha/check) pages -- a recent chrome update deprecated (broke) some stats APIs I was using, along with a new race condition issue caused results to not always save. (It's funny how working code starts to 'rust' over time)

#### September 16

* Added more details to the tech-check test's result page (vdo.ninja/alpha/results?id=xxx), including system detail and the network type. WiFi is of course isn't advised, so if it detects that, it points it out as seen in the photo.\
  ![](<../.gitbook/assets/image (15) (2).png>)![](<../.gitbook/assets/image (17).png>)

#### September 14

* I put together a first version of a tool designed to help with automated tech-checking of guests. Tool is located here currently: [https://vdo.ninja/alpha/check](https://vdo.ninja/alpha/check), although I may move it at some point.\
  \
  The tool is based after the speedtest I have up still, but once the test is complete, it offers a link to the results that can be shared. The results are stored on a server, anonymously, for up to a week, after which they expire and auto-delete.\
  \
  A demo results page can be found here: [https://vdo.ninja/alpha/results?id=steve12345](https://vdo.ninja/alpha/results?id=steve12345)\
  \
  The results include the details found within the speedtest, but also the bandwidth is ramped up from 2500, to 4000, and then to 6000 -- 30-seconds each, for a total of 90-seconds. The test then takes about 90 seconds to complete, and the end it auto-uploads the results.\
  \
  While the guest can send you the link of the results, you can also send the guest a link with the ID pre-set, so you can check the results at a later date without needing the guest's feedback. To do so, just add `?id=xxxx` to the test link. ie: `https://vdo.ninja/alpha/check?id=exampleGuest123`\
  \
  You can create an excel sheet of different links, for different guests, and then email them out to guests, asking that they complete the test before a stream. If there are problems with the guests's connection/computer, you'll be able to resolve them sooner this way.\
  \
  I'd still recommend you do a proper tech check before the stream regardless, but this 'pre-tech-check' can help in cases of larger groups.\
  \
  At some point I'll add a dashboard or notification system to make managing invite links easier, but that will probably be for another day.\
  ![](<../.gitbook/assets/image (1) (2).png>)
