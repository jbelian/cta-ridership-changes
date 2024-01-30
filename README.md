# [CTA Ridership Changes 🚌🚅](https://jbelian.github.io/cta-ridership-changes/)

I drew inspiration for this from my previous project, [Bus Ridership Forecasting](https://github.com/jbelian/WGU-Capstone-Bus-Ridership-Forecasting). This is an interactive map that visualizes month-to-month changes in ridership on the CTA (Chicago Transit Authority). The most notable period is from Feb 2020 to Apr 2020, which saw huge decreases in ridership at the start of the COVID-19 pandemic, up to a -98.6% decrease for one bus line in particular. A daily API call checks for new ridership data, and the app is updated if any is found. Updates to come:

- ~~Add a toggle to swap the display between bus routes and train routes [(the "L")](https://en.wikipedia.org/wiki/Chicago_%22L%22)~~ ✅
- ~~Add a legend for change in ridership, from blue (positive) to red (negative)~~ ✅
- ~~More informative tooltips~~ ✅

#### Ridership Info
> **About CTA ridership numbers**  
> Ridership statistics are provided on a system-wide and bus route/station-level basis. Ridership is primarily counted as boardings, that is, customers boarding a transit vehicle (bus or rail).  On the rail system, there is a distinction between station entries and total rides, or boardings. Datasets indicate such in their file name and description.
>
> **How people are counted on the 'L'**  
> On the rail system, a customer is counted as an "entry" each time he or she passes through a turnstile to enter a station.  Customers are not counted as "entries" when they make a "cross-platform" transfer from one rail line to another, since they don't pass through a turnstile. Where the number given for rail is in "boardings," what's presented is a statistically valid estimate of the actual number of boardings onto the rail system. 
>
> **How people are counted on buses**  
> Boardings are recorded using the bus farebox and farecard reader. In the uncommon situation when there is an operating error with the farebox and the onboard systems cannot determine on which route a given trip's boardings should be allocated, these boardings are tallied as Route 0 in some reports.  Route 1001 are shuttle buses used for construction or other unforeseen events.
