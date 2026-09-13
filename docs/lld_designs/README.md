# beingsde — Complete Low Level Design (LLD) Catalog

This repository houses production-grade, pattern-oriented Low Level Designs for all **27 LLD systems** featured on beingsde.in.

Every design strictly follows the 9-part enterprise LLD standard:
1. **Actors & Use Cases**
2. **Class Diagram (Mermaid)**
3. **Key Interfaces & Abstractions**
4. **Design Patterns Applied**
5. **Sequence / Interaction Diagrams (Mermaid)**
6. **Data Model & Schema Strategy**
7. **Concurrency & Thread Safety Plan**
8. **Failure Modes & Edge Cases**
9. **Extensibility Points**

---

## Complete Index of LLD Designs

| # | System Name | Difficulty | Tag / Category | Primary Patterns | Specification |
|---|-------------|------------|----------------|------------------|---------------|
| 1 | [Tic Tac Toe](./tic-tac-toe.md) | **Easy** | Game Design | Strategy (Move validation / Bot AI), Singleton (Game Config/Rules Engine), Observer (Turn / Game Status events) | [View LLD](./tic-tac-toe.md) |
| 2 | [Traffic Signal](./traffic-signal.md) | **Easy** | State / Control | State Pattern (Signal transitions), Observer (Intersection sensors), Singleton (Intersection Manager) | [View LLD](./traffic-signal.md) |
| 3 | [Chess Clock](./chess-clock.md) | **Easy** | State / Behavioral | State Pattern (Running, Paused, Flagged), Observer Pattern (Time tick and flag alerts), Strategy (Delay modes: Fischer, Bronstein, Simple) | [View LLD](./chess-clock.md) |
| 4 | [Logger Framework](./logger.md) | **Easy** | Behavioral | Chain of Responsibility (Log level filtering), Singleton (LogManager), Observer / Strategy (Log Appenders/Sinks) | [View LLD](./logger.md) |
| 5 | [Coffee Machine](./coffee-machine.md) | **Easy** | State / Behavioral | State Pattern (Machine cycles), Factory Pattern (Drink creation), Decorator Pattern (Add-ons / Condiments) | [View LLD](./coffee-machine.md) |
| 6 | [Vending Machine](./vending-machine.md) | **Easy** | State Pattern / Behavioral | State Pattern (Lifecycle: Idle, HasCoin, Dispense, SoldOut), Chain of Responsibility (Cash change dispensation) | [View LLD](./vending-machine.md) |
| 7 | [Parking Lot System](./parking-lot-system.md) | **Medium** | Object-Oriented Design | Singleton (Parking Lot), Factory Method (Spot/Vehicle creation), Strategy (Pricing calculation), Observer (Display board) | [View LLD](./parking-lot-system.md) |
| 8 | [Snake & Ladder](./snake-ladder.md) | **Medium** | OOD / Game | Singleton (Game Rules), Strategy (Dice rolling: single, double, crooked), Observer (Move & Event broadcaster) | [View LLD](./snake-ladder.md) |
| 9 | [Library Management System](./library-management-system.md) | **Medium** | CRUD / OOD | Factory (Member/Book creation), Strategy (Search by title, author, ISBN), Observer (Fine & Reserve alerts) | [View LLD](./library-management-system.md) |
| 10 | [Cricbuzz (Live Cricket Score)](./cricbuzz.md) | **Medium** | Publisher / Subscriber | Observer (Pub-Sub score updates), Strategy (Run rate calculation / DLS method), Factory (Match type creation: T20, ODI, Test) | [View LLD](./cricbuzz.md) |
| 11 | [Restaurant Management System](./restaurant.md) | **Medium** | Object-Oriented Design | Factory (Order item preparation), Observer (Kitchen Display System alerts), Strategy (Bill calculation & discounts) | [View LLD](./restaurant.md) |
| 12 | [Cache (LRU / LFU)](./cache.md) | **Medium** | Structural | Proxy Pattern (Transparent caching layer), Strategy Pattern (Eviction policy: LRU, LFU, FIFO), Singleton (CacheManager) | [View LLD](./cache.md) |
| 13 | [File System](./file-system.md) | **Medium** | Structural Design | Composite Pattern (Hierarchical Files and Directories), Command Pattern (Undoable fs operations), Iterator (Directory traversal) | [View LLD](./file-system.md) |
| 14 | [Amazon Locker](./amazon-locker.md) | **Medium** | OOD / Allocation | Strategy (Locker slot allocation: nearest, best fit), Factory (Locker sizes), Observer (Delivery and Customer pickup PIN notifications) | [View LLD](./amazon-locker.md) |
| 15 | [Online Auction System](./online-auction-system.md) | **Medium** | Publisher / Subscriber | Observer (Bid alerts & price tickers), State Pattern (Auction Lifecycle: Created, Active, Closed, Settled), Mediator (Auctioneer orchestrator) | [View LLD](./online-auction-system.md) |
| 16 | [BookMyShow (Movie Ticket Booking)](./bookmyshow.md) | **Hard** | Concurrency / Transactional | Strategy (Dynamic ticket pricing), Observer (Seat lock timer & release), State Pattern (Seat: Available, Reserved, Booked) | [View LLD](./bookmyshow.md) |
| 17 | [Splitwise (Expense Sharing App)](./splitwise.md) | **Hard** | Object-Oriented Design | Strategy (Split methods: Exact, Equal, Percentage, Shares), Factory (Expense creation), Observer (Activity feed notifications) | [View LLD](./splitwise.md) |
| 18 | [Elevator System](./elevator-system.md) | **Hard** | System Design / State | State Pattern (Elevator Car: MovingUp, MovingDown, Idle, Maintenance), Strategy (Dispatch algorithm: SCAN, LOOK, Destination Dispatch) | [View LLD](./elevator-system.md) |
| 19 | [Chess Game](./chess.md) | **Hard** | OOD / Game | Factory Method (Piece instantiation), Command Pattern (Move execution, undo, and replay), Strategy (Move validation per piece) | [View LLD](./chess.md) |
| 20 | [ATM Machine](./atm-machine.md) | **Hard** | State / Concurrency | State Pattern (CardInserted, PinEntered, TransactionSelected, Dispensing), Chain of Responsibility (Cash dispenser: $100 -> $50 -> $20 bills) | [View LLD](./atm-machine.md) |
| 21 | [Hotel Management](./hotel-management.md) | **Hard** | Transactional / OOD | Factory (Room type creation), Observer (Housekeeping and Booking notifications), Strategy (Seasonal dynamic tariff) | [View LLD](./hotel-management.md) |
| 22 | [Uber / Ride-Hailing](./uber.md) | **Hard** | Proximity / Dispatch | Observer (Live GPS location and trip status events), Strategy (Surge pricing & driver matching), State Pattern (Trip: Requested, Accepted, Arrived, InTrip, Completed) | [View LLD](./uber.md) |
| 23 | [Google Docs](./google-docs.md) | **Hard** | Concurrency / Realtime | Command Pattern (Document editing operations), Observer (Collaborator broadcast), Strategy (Operational Transformation / CRDT conflict resolution) | [View LLD](./google-docs.md) |
| 24 | [Airline Reservation](./airline-reservation.md) | **Hard** | Transactional / Concurrency | Factory (Seat/Flight class creation), Observer (Flight delay and gate change alerts), Strategy (Baggage and fare rules) | [View LLD](./airline-reservation.md) |
| 25 | [WhatsApp / Chat System](./whatsapp.md) | **Hard** | Distributed OOD | Observer (Push notifications and live presence), Strategy (Message encryption & media compression), Singleton (Connection Manager) | [View LLD](./whatsapp.md) |
| 26 | [Distributed Inventory System](./inventory-system.md) | **Hard** | Transactional / OOD | Strategy (Inventory allocation: FIFO, Nearest Warehouse), Observer (Restock threshold triggers), Command (Inventory adjustments) | [View LLD](./inventory-system.md) |
| 27 | [Ride Sharing (Carpooling / Pool)](./ride-sharing.md) | **Hard** | OOD / Concurrency | Strategy (Route overlapping & detour optimization), Observer (Dynamic matching & passenger onboard alerts), State Pattern (Shared Vehicle: Empty, PartiallyFilled, Full) | [View LLD](./ride-sharing.md) |
