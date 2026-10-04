const fs = require("fs");
const path = require("path");

const lldPath = path.resolve(__dirname, "../../beingsde-ui/src/data/lld.json");
const lldData = JSON.parse(fs.readFileSync(lldPath, "utf-8"));

const batch3 = {};

// ─────────────────────────────────────────────────────────────
// 19. CHESS
// ─────────────────────────────────────────────────────────────
batch3["chess"] = {
  java: `import java.util.*;

enum PieceColor { WHITE, BLACK }
enum PieceType { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN }

abstract class Piece {
    protected final PieceColor color;
    protected final PieceType type;
    public Piece(PieceColor color, PieceType type) { this.color = color; this.type = type; }
    public PieceColor getColor() { return color; }
    public PieceType getType() { return type; }
    public abstract boolean canMove(int startR, int startC, int endR, int endC, Piece[][] board);
}

class Rook extends Piece {
    public Rook(PieceColor color) { super(color, PieceType.ROOK); }
    public boolean canMove(int startR, int startC, int endR, int endC, Piece[][] board) {
        return startR == endR || startC == endC;
    }
}

class King extends Piece {
    public King(PieceColor color) { super(color, PieceType.KING); }
    public boolean canMove(int startR, int startC, int endR, int endC, Piece[][] board) {
        return Math.max(Math.abs(startR - endR), Math.abs(startC - endC)) == 1;
    }
}

class ChessBoard {
    private final Piece[][] board = new Piece[8][8];

    public ChessBoard() {
        // Place initial pieces
        board[0][0] = new Rook(PieceColor.BLACK);
        board[0][4] = new King(PieceColor.BLACK);
        board[7][0] = new Rook(PieceColor.WHITE);
        board[7][4] = new King(PieceColor.WHITE);
    }

    public boolean move(int sR, int sC, int eR, int eC, PieceColor turnColor) {
        Piece p = board[sR][sC];
        if (p == null || p.getColor() != turnColor) {
            System.out.println("❌ Invalid selection. Not your piece.");
            return false;
        }
        if (!p.canMove(sR, sC, eR, eC, board)) {
            System.out.println("❌ Illegal move pattern for " + p.getType());
            return false;
        }
        Piece captured = board[eR][eC];
        board[eR][eC] = p;
        board[sR][sC] = null;
        System.out.printf("♟️ %s %s moved (%d,%d) -> (%d,%d)%s\\n",
                p.getColor(), p.getType(), sR, sC, eR, eC,
                (captured != null ? " [Captured " + captured.getType() + "]" : ""));
        return true;
    }
}

public class Main {
    public static void main(String[] args) {
        ChessBoard cb = new ChessBoard();
        cb.move(7, 0, 4, 0, PieceColor.WHITE); // White Rook moves up
        cb.move(0, 4, 1, 4, PieceColor.BLACK); // Black King moves down
    }
}`,
  cpp: `#include <iostream>
#include <vector>
#include <memory>

enum class Color { WHITE, BLACK };

class Piece {
public:
    Color color;
    Piece(Color c) : color(c) {}
    virtual ~Piece() = default;
    virtual bool isValidMove(int sR, int sC, int eR, int eC) = 0;
};

class Rook : public Piece {
public:
    Rook(Color c) : Piece(c) {}
    bool isValidMove(int sR, int sC, int eR, int eC) override {
        return sR == eR || sC == eC;
    }
};

int main() {
    Rook whiteRook(Color::WHITE);
    std::cout << "Rook vertical move valid: " << whiteRook.isValidMove(7, 0, 3, 0) << "\\n";
    return 0;
}`,
  python: `class Piece:
    def __init__(self, color: str, p_type: str):
        self.color = color
        self.p_type = p_type

    def is_valid_move(self, s_r: int, s_c: int, e_r: int, e_c: int) -> bool:
        pass

class Rook(Piece):
    def __init__(self, color: str):
        super().__init__(color, "ROOK")

    def is_valid_move(self, s_r: int, s_c: int, e_r: int, e_c: int) -> bool:
        return s_r == e_r or s_c == e_c

if __name__ == "__main__":
    rook = Rook("WHITE")
    print("Move valid:", rook.is_valid_move(7, 0, 3, 0))`
};

// ─────────────────────────────────────────────────────────────
// 20. ATM MACHINE
// ─────────────────────────────────────────────────────────────
batch3["atm-machine"] = {
  java: `import java.util.*;

// State Pattern
interface ATMState {
    void insertCard(ATM atm);
    void enterPin(ATM atm, int pin);
    void withdrawCash(ATM atm, int amount);
    void ejectCard(ATM atm);
}

// Chain of Responsibility for Dispenser
abstract class CashDispenser {
    protected CashDispenser nextDispenser;
    protected final int denomination;
    protected int noteCount;

    public CashDispenser(int denom, int count) {
        this.denomination = denom;
        this.noteCount = count;
    }
    public void setNext(CashDispenser next) { this.nextDispenser = next; }

    public void dispense(int amount) {
        int notesToDispense = Math.min(amount / denomination, noteCount);
        if (notesToDispense > 0) {
            noteCount -= notesToDispense;
            amount -= notesToDispense * denomination;
            System.out.println("💵 Dispensed " + notesToDispense + " x $" + denomination + " notes");
        }
        if (amount > 0 && nextDispenser != null) {
            nextDispenser.dispense(amount);
        } else if (amount > 0) {
            System.out.println("❌ ATM out of smaller change for remainder $" + amount);
        }
    }
}

class TwoThousandDispenser extends CashDispenser { public TwoThousandDispenser(int c) { super(2000, c); } }
class FiveHundredDispenser extends CashDispenser { public FiveHundredDispenser(int c) { super(500, c); } }
class OneHundredDispenser extends CashDispenser { public OneHundredDispenser(int c) { super(100, c); } }

class IdleState implements ATMState {
    public void insertCard(ATM atm) {
        System.out.println("💳 Card inserted. Please enter 4-digit PIN.");
        atm.setState(atm.getHasCardState());
    }
    public void enterPin(ATM atm, int pin) { System.out.println("Insert card first."); }
    public void withdrawCash(ATM atm, int amount) { System.out.println("Insert card first."); }
    public void ejectCard(ATM atm) { System.out.println("No card to eject."); }
}

class HasCardState implements ATMState {
    public void insertCard(ATM atm) { System.out.println("Card already in ATM."); }
    public void enterPin(ATM atm, int pin) {
        if (pin == 1234) {
            System.out.println("✅ PIN Authenticated successfully.");
            atm.setState(atm.getAuthenticatedState());
        } else {
            System.out.println("❌ Incorrect PIN.");
        }
    }
    public void withdrawCash(ATM atm, int amount) { System.out.println("Enter PIN first."); }
    public void ejectCard(ATM atm) {
        System.out.println("Card ejected.");
        atm.setState(atm.getIdleState());
    }
}

class AuthenticatedState implements ATMState {
    public void insertCard(ATM atm) { System.out.println("Session in progress."); }
    public void enterPin(ATM atm, int pin) { System.out.println("Already authenticated."); }
    public void withdrawCash(ATM atm, int amount) {
        System.out.println("Processing withdrawal of $" + amount + "...");
        atm.getDispenserChain().dispense(amount);
        ejectCard(atm);
    }
    public void ejectCard(ATM atm) {
        System.out.println("Card ejected. Thank you for banking with us.");
        atm.setState(atm.getIdleState());
    }
}

class ATM {
    private final ATMState idle = new IdleState();
    private final ATMState hasCard = new HasCardState();
    private final ATMState authenticated = new AuthenticatedState();
    private ATMState state = idle;
    private final CashDispenser dispenserChain;

    public ATM() {
        CashDispenser d2000 = new TwoThousandDispenser(10);
        CashDispenser d500 = new FiveHundredDispenser(20);
        CashDispenser d100 = new OneHundredDispenser(50);
        d2000.setNext(d500);
        d500.setNext(d100);
        this.dispenserChain = d2000;
    }

    public void setState(ATMState s) { this.state = s; }
    public ATMState getIdleState() { return idle; }
    public ATMState getHasCardState() { return hasCard; }
    public ATMState getAuthenticatedState() { return authenticated; }
    public CashDispenser getDispenserChain() { return dispenserChain; }

    public void insertCard() { state.insertCard(this); }
    public void enterPin(int pin) { state.enterPin(this, pin); }
    public void withdrawCash(int amount) { state.withdrawCash(this, amount); }
}

public class Main {
    public static void main(String[] args) {
        ATM atm = new ATM();
        atm.insertCard();
        atm.enterPin(1234);
        atm.withdrawCash(3700); // 1x2000, 3x500, 2x100
    }
}`,
  cpp: `#include <iostream>
#include <algorithm>

class Dispenser {
    int denom;
    int count;
    Dispenser* next = nullptr;
public:
    Dispenser(int d, int c) : denom(d), count(c) {}
    void setNext(Dispenser* n) { next = n; }
    void dispense(int amt) {
        int notes = std::min(amt / denom, count);
        if (notes > 0) {
            std::cout << "Dispensed " << notes << " x $" << denom << "\\n";
            amt -= notes * denom;
            count -= notes;
        }
        if (amt > 0 && next) next->dispense(amt);
    }
};

int main() {
    Dispenser d500(500, 5);
    Dispenser d100(100, 10);
    d500.setNext(&d100);
    d500.dispense(1300);
    return 0;
}`,
  python: `class CashDispenser:
    def __init__(self, denom: int, count: int, next_dispenser=None):
        self.denom = denom
        self.count = count
        self.next = next_dispenser

    def dispense(self, amount: int):
        notes = min(amount // self.denom, self.count)
        if notes > 0:
            amount -= notes * self.denom
            self.count -= notes
            print(f"💵 Dispensed {notes} x \${self.denom}")
        if amount > 0 and self.next:
            self.next.dispense(amount)

if __name__ == "__main__":
    d100 = CashDispenser(100, 10)
    d500 = CashDispenser(500, 5, d100)
    print("Withdrawal $1300:")
    d500.dispense(1300)`
};

// ─────────────────────────────────────────────────────────────
// 21. HOTEL MANAGEMENT
// ─────────────────────────────────────────────────────────────
batch3["hotel-management"] = {
  java: `import java.time.LocalDate;
import java.util.*;

enum RoomType { STANDARD(100), DELUXE(180), SUITE(350);
    final double baseRate;
    RoomType(double rate) { this.baseRate = rate; }
}

class Room {
    private final int roomNumber;
    private final RoomType type;
    public Room(int num, RoomType type) { this.roomNumber = num; this.type = type; }
    public int getRoomNumber() { return roomNumber; }
    public RoomType getType() { return type; }
}

class Booking {
    private final String bookingId;
    private final Room room;
    private final LocalDate checkIn, checkOut;

    public Booking(String id, Room r, LocalDate in, LocalDate out) {
        this.bookingId = id; this.room = r; this.checkIn = in; this.checkOut = out;
    }
    public boolean overlaps(LocalDate in, LocalDate out) {
        return !in.isAfter(checkOut) && !out.isBefore(checkIn);
    }
    public Room getRoom() { return room; }
}

class Hotel {
    private final List<Room> rooms = new ArrayList<>();
    private final List<Booking> bookings = new ArrayList<>();

    public void addRoom(Room r) { rooms.add(r); }

    public synchronized Booking bookRoom(RoomType type, LocalDate checkIn, LocalDate checkOut) {
        for (Room r : rooms) {
            if (r.getType() != type) continue;
            boolean occupied = bookings.stream()
                    .filter(b -> b.getRoom().getRoomNumber() == r.getRoomNumber())
                    .anyMatch(b -> b.overlaps(checkIn, checkOut));
            if (!occupied) {
                Booking b = new Booking("BKG-" + UUID.randomUUID().toString().substring(0, 6), r, checkIn, checkOut);
                bookings.add(b);
                System.out.println("🏨 Booked Room #" + r.getRoomNumber() + " (" + type + ") from " + checkIn + " to " + checkOut);
                return b;
            }
        }
        System.out.println("❌ No rooms available for " + type);
        return null;
    }
}

public class Main {
    public static void main(String[] args) {
        Hotel hotel = new Hotel();
        hotel.addRoom(new Room(101, RoomType.DELUXE));
        hotel.addRoom(new Room(102, RoomType.DELUXE));

        LocalDate today = LocalDate.now();
        hotel.bookRoom(RoomType.DELUXE, today, today.plusDays(2));
        hotel.bookRoom(RoomType.DELUXE, today, today.plusDays(3));
        hotel.bookRoom(RoomType.DELUXE, today, today.plusDays(1)); // should fail (only 2 deluxe)
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <vector>

struct Room {
    int id;
    bool booked = false;
};

class Hotel {
    std::vector<Room> rooms;
public:
    Hotel(int count) {
        for (int i = 1; i <= count; i++) rooms.push_back({i, false});
    }
    int book() {
        for (auto& r : rooms) {
            if (!r.booked) {
                r.booked = true;
                std::cout << "Booked Room #" << r.id << "\\n";
                return r.id;
            }
        }
        std::cout << "No rooms available\\n";
        return -1;
    }
};

int main() {
    Hotel h(2);
    h.book();
    h.book();
    h.book();
    return 0;
}`,
  python: `class Hotel:
    def __init__(self, rooms_count: int = 5):
        self.rooms = {i: False for i in range(101, 101 + rooms_count)}

    def book_room(self, guest_name: str) -> int:
        for r_num, booked in self.rooms.items():
            if not booked:
                self.rooms[r_num] = True
                print(f"🏨 Room #{r_num} booked for {guest_name}!")
                return r_num
        print(f"❌ Hotel Full! Cannot accommodate {guest_name}")
        return None

if __name__ == "__main__":
    hotel = Hotel(2)
    hotel.book_room("Alice")
    hotel.book_room("Bob")
    hotel.book_room("Charlie")`
};

// ─────────────────────────────────────────────────────────────
// 22. UBER / RIDE HAILING
// ─────────────────────────────────────────────────────────────
batch3["uber"] = {
  java: `import java.util.*;

class Location {
    final double lat, lon;
    public Location(double lat, double lon) { this.lat = lat; this.lon = lon; }
    public double distanceTo(Location o) {
        return Math.sqrt(Math.pow(lat - o.lat, 2) + Math.pow(lon - o.lon, 2));
    }
}

class Driver {
    private final String id, name;
    private Location location;
    private boolean isAvailable = true;

    public Driver(String id, String n, Location loc) { this.id = id; this.name = n; this.location = loc; }
    public Location getLocation() { return location; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean a) { this.isAvailable = a; }
    public String getName() { return name; }
}

interface MatchingStrategy {
    Driver findDriver(Location pickup, List<Driver> drivers);
}

class NearestDriverStrategy implements MatchingStrategy {
    public Driver findDriver(Location pickup, List<Driver> drivers) {
        Driver best = null;
        double minDistance = Double.MAX_VALUE;
        for (Driver d : drivers) {
            if (d.isAvailable()) {
                double dist = d.getLocation().distanceTo(pickup);
                if (dist < minDistance) {
                    minDistance = dist;
                    best = d;
                }
            }
        }
        return best;
    }
}

class RideService {
    private final List<Driver> drivers = new ArrayList<>();
    private final MatchingStrategy matchingStrategy = new NearestDriverStrategy();

    public void registerDriver(Driver d) { drivers.add(d); }

    public synchronized boolean requestRide(String rider, Location pickup, Location dropoff) {
        Driver d = matchingStrategy.findDriver(pickup, drivers);
        if (d != null) {
            d.setAvailable(false);
            double fare = pickup.distanceTo(dropoff) * 15.0; // $15 per unit distance
            System.out.printf("🚗 Matched %s with Driver %s! Estimated Fare: $%.2f\\n", rider, d.getName(), fare);
            return true;
        }
        System.out.println("❌ No nearby drivers available for " + rider);
        return false;
    }
}

public class Main {
    public static void main(String[] args) {
        RideService uber = new RideService();
        uber.registerDriver(new Driver("D1", "John", new Location(10.0, 10.0)));
        uber.registerDriver(new Driver("D2", "David", new Location(25.0, 25.0)));

        uber.requestRide("Alice", new Location(11.0, 10.5), new Location(15.0, 15.0));
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <vector>
#include <cmath>

struct Driver {
    std::string name;
    double x, y;
    bool available = true;
};

class Dispatcher {
    std::vector<Driver> drivers;
public:
    void addDriver(Driver d) { drivers.push_back(d); }
    std::string match(double px, double py) {
        for (auto& d : drivers) {
            if (d.available) {
                d.available = false;
                std::cout << "Matched with driver " << d.name << "\\n";
                return d.name;
            }
        }
        return "None";
    }
};

int main() {
    Dispatcher d;
    d.addDriver({"Dave", 1.0, 1.0});
    d.match(1.2, 1.1);
    return 0;
}`,
  python: `class Driver:
    def __init__(self, name: str, lat: float, lon: float):
        self.name = name
        self.lat = lat
        self.lon = lon
        self.available = True

class RideService:
    def __init__(self):
        self.drivers = []

    def add_driver(self, d: Driver): self.drivers.append(d)

    def request_ride(self, rider: str, p_lat: float, p_lon: float):
        available = [d for d in self.drivers if d.available]
        if not available:
            print(f"❌ No drivers found for {rider}")
            return None
        # Find nearest
        nearest = min(available, key=lambda d: (d.lat - p_lat)**2 + (d.lon - p_lon)**2)
        nearest.available = False
        print(f"🚖 Matched rider {rider} with {nearest.name}!")
        return nearest

if __name__ == "__main__":
    service = RideService()
    service.add_driver(Driver("Alex", 12.97, 77.59))
    service.request_ride("Alice", 12.98, 77.60)`
};

// ─────────────────────────────────────────────────────────────
// 23. GOOGLE DOCS (OPERATIONAL TRANSFORMATION)
// ─────────────────────────────────────────────────────────────
batch3["google-docs"] = {
  java: `import java.util.*;

enum OpType { INSERT, DELETE }

class Operation {
    final OpType type;
    final int position;
    final String text;
    final int revision;

    public Operation(OpType t, int pos, String txt, int rev) {
        this.type = t; this.position = pos; this.text = txt; this.revision = rev;
    }
}

class OTConflictResolver {
    public static Operation transform(Operation clientOp, Operation serverOp) {
        if (clientOp.type == OpType.INSERT && serverOp.type == OpType.INSERT) {
            if (clientOp.position > serverOp.position) {
                return new Operation(clientOp.type, clientOp.position + serverOp.text.length(), clientOp.text, clientOp.revision + 1);
            }
        }
        return clientOp;
    }
}

class Document {
    private final StringBuilder content = new StringBuilder();
    private int revision = 0;

    public synchronized void apply(Operation op) {
        if (op.type == OpType.INSERT) {
            content.insert(op.position, op.text);
        } else if (op.type == OpType.DELETE) {
            content.delete(op.position, op.position + op.text.length());
        }
        revision++;
        System.out.printf("📄 [Rev %d] Doc content: \\"%s\\"\\n", revision, content);
    }
    public int getRevision() { return revision; }
}

public class Main {
    public static void main(String[] args) {
        Document doc = new Document();
        // User 1 inserts "Hello"
        Operation op1 = new Operation(OpType.INSERT, 0, "Hello", 0);
        doc.apply(op1);

        // User 2 inserts " World" at index 5
        Operation op2 = new Operation(OpType.INSERT, 5, " World", 1);
        doc.apply(op2);
    }
}`,
  cpp: `#include <iostream>
#include <string>

enum class OpType { INSERT, DELETE };

struct Operation {
    OpType type;
    int pos;
    std::string text;
};

class Document {
    std::string text;
public:
    void apply(const Operation& op) {
        if (op.type == OpType.INSERT) {
            text.insert(op.pos, op.text);
        }
        std::cout << "Doc: \\"" << text << "\\"\\n";
    }
};

int main() {
    Document doc;
    doc.apply({OpType::INSERT, 0, "Hello"});
    doc.apply({OpType::INSERT, 5, " World"});
    return 0;
}`,
  python: `class Document:
    def __init__(self):
        self.text = ""
        self.version = 0

    def apply_insert(self, pos: int, char: str):
        self.text = self.text[:pos] + char + self.text[pos:]
        self.version += 1
        print(f"📄 [v{self.version}] \\"{self.text}\\"")

if __name__ == "__main__":
    doc = Document()
    doc.apply_insert(0, "Code")
    doc.apply_insert(4, " Craft")`
};

// ─────────────────────────────────────────────────────────────
// 24. AIRLINE RESERVATION
// ─────────────────────────────────────────────────────────────
batch3["airline-reservation"] = {
  java: `import java.util.*;

enum CabinClass { ECONOMY, BUSINESS, FIRST }

class FlightSeat {
    private final String seatNumber;
    private final CabinClass cabinClass;
    private boolean isBooked = false;

    public FlightSeat(String num, CabinClass cls) { this.seatNumber = num; this.cabinClass = cls; }
    public boolean isBooked() { return isBooked; }
    public void setBooked(boolean b) { this.isBooked = b; }
    public String getSeatNumber() { return seatNumber; }
}

class Flight {
    private final String flightNumber, origin, destination;
    private final Map<String, FlightSeat> seats = new HashMap<>();

    public Flight(String num, String from, String to) {
        this.flightNumber = num; this.origin = from; this.destination = to;
        seats.put("1A", new FlightSeat("1A", CabinClass.BUSINESS));
        seats.put("10A", new FlightSeat("10A", CabinClass.ECONOMY));
        seats.put("10B", new FlightSeat("10B", CabinClass.ECONOMY));
    }

    public synchronized String reserveSeat(String passengerName, String seatNum) {
        FlightSeat seat = seats.get(seatNum);
        if (seat != null && !seat.isBooked()) {
            seat.setBooked(true);
            String pnr = "PNR-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            System.out.printf("✈️ Reserved seat %s on %s (%s->%s) for %s. PNR: %s\\n",
                    seatNum, flightNumber, origin, destination, passengerName, pnr);
            return pnr;
        }
        System.out.println("❌ Seat " + seatNum + " is unavailable on flight " + flightNumber);
        return null;
    }
}

public class Main {
    public static void main(String[] args) {
        Flight f = new Flight("AI-202", "DEL", "JFK");
        f.reserveSeat("Alice", "10A");
        f.reserveSeat("Bob", "10A"); // Seat collision
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <unordered_map>

class Flight {
    std::unordered_map<std::string, bool> seats;
public:
    Flight() { seats["1A"] = false; seats["1B"] = false; }
    bool book(const std::string& seat, const std::string& passenger) {
        if (seats.count(seat) && !seats[seat]) {
            seats[seat] = true;
            std::cout << "Flight seat " << seat << " booked for " << passenger << "\\n";
            return true;
        }
        std::cout << "Seat " << seat << " not available\\n";
        return false;
    }
};

int main() {
    Flight fl;
    fl.book("1A", "Alice");
    fl.book("1A", "Bob");
    return 0;
}`,
  python: `import uuid

class FlightBooking:
    def __init__(self, flight_no: str):
        self.flight_no = flight_no
        self.seats = {"12A": None, "12B": None, "1A": None}

    def book(self, passenger: str, seat: str) -> str:
        if self.seats.get(seat) is None:
            pnr = str(uuid.uuid4())[:6].upper()
            self.seats[seat] = passenger
            print(f"✈️ Booked Seat {seat} on {self.flight_no} for {passenger}. PNR: {pnr}")
            return pnr
        print(f"❌ Seat {seat} already booked!")
        return None

if __name__ == "__main__":
    flight = FlightBooking("BA-178")
    flight.book("Alice", "12A")
    flight.book("Bob", "12A")`
};

// ─────────────────────────────────────────────────────────────
// 25. WHATSAPP / CHAT SYSTEM
// ─────────────────────────────────────────────────────────────
batch3["whatsapp"] = {
  java: `import java.util.*;

enum MessageStatus { SENT, DELIVERED, READ }

class ChatMessage {
    final String senderId, content;
    final long timestamp;
    MessageStatus status = MessageStatus.SENT;

    public ChatMessage(String from, String msg) {
        this.senderId = from; this.content = msg; this.timestamp = System.currentTimeMillis();
    }
}

class ChatUser {
    private final String userId, name;
    public ChatUser(String id, String n) { this.userId = id; this.name = n; }
    public void receiveMessage(String fromUser, String msg) {
        System.out.printf("💬 [%s received from %s]: %s\\n", name, fromUser, msg);
    }
    public String getUserId() { return userId; }
    public String getName() { return name; }
}

class ChatGroup {
    private final String groupId;
    private final Map<String, ChatUser> members = new HashMap<>();

    public ChatGroup(String id) { this.groupId = id; }
    public void addMember(ChatUser u) { members.put(u.getUserId(), u); }

    public void broadcast(String senderId, String text) {
        ChatMessage msg = new ChatMessage(senderId, text);
        for (ChatUser member : members.values()) {
            if (!member.getUserId().equals(senderId)) {
                member.receiveMessage(senderId, text);
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        ChatUser u1 = new ChatUser("U1", "Alice");
        ChatUser u2 = new ChatUser("U2", "Bob");
        ChatUser u3 = new ChatUser("U3", "Charlie");

        ChatGroup group = new ChatGroup("EngTeam");
        group.addMember(u1);
        group.addMember(u2);
        group.addMember(u3);

        group.broadcast("U1", "Deployment to production is complete!");
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <vector>

class User {
public:
    std::string name;
    User(std::string n) : name(n) {}
    void onMsg(const std::string& from, const std::string& text) {
        std::cout << name << " got msg from " << from << ": " << text << "\\n";
    }
};

int main() {
    User u1("Alice"), u2("Bob");
    u2.onMsg(u1.name, "Hey Bob!");
    return 0;
}`,
  python: `class ChatRoom:
    def __init__(self, name: str):
        self.name = name
        self.users = {}

    def join(self, username: str):
        self.users[username] = True

    def send(self, sender: str, msg: str):
        for user in self.users:
            if user != sender:
                print(f"💬 [{user} inbox from {sender}]: {msg}")

if __name__ == "__main__":
    chat = ChatRoom("System Architects")
    chat.join("Alice")
    chat.join("Bob")
    chat.send("Alice", "Kafka cluster upgraded successfully!")`
};

// ─────────────────────────────────────────────────────────────
// 26. INVENTORY SYSTEM
// ─────────────────────────────────────────────────────────────
batch3["inventory-system"] = {
  java: `import java.util.concurrent.ConcurrentHashMap;

class InventoryWarehouse {
    private final ConcurrentHashMap<String, Integer> stock = new ConcurrentHashMap<>();

    public void addStock(String sku, int quantity) {
        stock.merge(sku, quantity, Integer::sum);
        System.out.printf("📦 Restocked SKU %s with %d units. Total: %d\\n", sku, quantity, stock.get(sku));
    }

    public synchronized boolean reserveStock(String sku, int quantity) {
        int current = stock.getOrDefault(sku, 0);
        if (current >= quantity) {
            stock.put(sku, current - quantity);
            System.out.printf("✅ Reserved %d units of SKU %s. Remaining: %d\\n", quantity, sku, stock.get(sku));
            return true;
        }
        System.out.printf("❌ Insufficient stock for SKU %s (Requested: %d, Available: %d)\\n", sku, quantity, current);
        return false;
    }
}

public class Main {
    public static void main(String[] args) {
        InventoryWarehouse warehouse = new InventoryWarehouse();
        warehouse.addStock("MACBOOK_M3", 10);
        warehouse.reserveStock("MACBOOK_M3", 3);
        warehouse.reserveStock("MACBOOK_M3", 8); // Should fail (only 7 left)
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <unordered_map>

class Warehouse {
    std::unordered_map<std::string, int> stock;
public:
    void add(const std::string& sku, int qty) { stock[sku] += qty; }
    bool reserve(const std::string& sku, int qty) {
        if (stock[sku] >= qty) {
            stock[sku] -= qty;
            std::cout << "Reserved " << qty << " of " << sku << "\\n";
            return true;
        }
        std::cout << "Out of stock for " << sku << "\\n";
        return false;
    }
};

int main() {
    Warehouse wh;
    wh.add("SKU_PHONE", 5);
    wh.reserve("SKU_PHONE", 2);
    return 0;
}`,
  python: `class InventorySystem:
    def __init__(self):
        self.stock = {}

    def restock(self, sku: str, count: int):
        self.stock[sku] = self.stock.get(sku, 0) + count
        print(f"📦 Restocked {sku} (+{count}). In stock: {self.stock[sku]}")

    def reserve(self, sku: str, count: int) -> bool:
        if self.stock.get(sku, 0) >= count:
            self.stock[sku] -= count
            print(f"✅ Reserved {count}x {sku}. Remaining: {self.stock[sku]}")
            return True
        print(f"❌ Out of stock for {sku}!")
        return False

if __name__ == "__main__":
    inv = InventorySystem()
    inv.restock("GPU_4090", 2)
    inv.reserve("GPU_4090", 1)
    inv.reserve("GPU_4090", 2)`
};

// ─────────────────────────────────────────────────────────────
// 27. RIDE SHARING (CARPOOLING)
// ─────────────────────────────────────────────────────────────
batch3["ride-sharing"] = {
  java: `import java.util.*;

class CarpoolRide {
    private final String rideId, driverName;
    private final String origin, destination;
    private int availableSeats;
    private final double costPerSeat;
    private final List<String> passengers = new ArrayList<>();

    public CarpoolRide(String id, String driver, String from, String to, int seats, double cost) {
        this.rideId = id; this.driverName = driver; this.origin = from;
        this.destination = to; this.availableSeats = seats; this.costPerSeat = cost;
    }

    public synchronized boolean bookSeat(String passengerName) {
        if (availableSeats > 0) {
            passengers.add(passengerName);
            availableSeats--;
            System.out.printf("🚘 %s booked seat with %s (%s -> %s) for $%.2f. Seats left: %d\\n",
                    passengerName, driverName, origin, destination, costPerSeat, availableSeats);
            return true;
        }
        System.out.println("❌ Ride from " + origin + " to " + destination + " is full!");
        return false;
    }
}

public class Main {
    public static void main(String[] args) {
        CarpoolRide ride = new CarpoolRide("RIDE-01", "Alex", "Downtown", "Airport", 2, 18.50);
        ride.bookSeat("Bob");
        ride.bookSeat("Charlie");
        ride.bookSeat("Dave"); // Should fail
    }
}`,
  cpp: `#include <iostream>
#include <string>

class Carpool {
    int seats;
public:
    Carpool(int s) : seats(s) {}
    bool book(const std::string& name) {
        if (seats > 0) {
            seats--;
            std::cout << name << " booked seat! Left: " << seats << "\\n";
            return true;
        }
        std::cout << "No seats for " << name << "\\n";
        return false;
    }
};

int main() {
    Carpool cp(1);
    cp.book("Alice");
    cp.book("Bob");
    return 0;
}`,
  python: `class CarpoolOffer:
    def __init__(self, driver: str, origin: str, dest: str, seats: int, fare: float):
        self.driver = driver
        self.origin = origin
        self.dest = dest
        self.seats = seats
        self.fare = fare
        self.passengers = []

    def book_seat(self, rider: str) -> bool:
        if self.seats > 0:
            self.seats -= 1
            self.passengers.append(rider)
            print(f"🚗 {rider} booked with {self.driver} ({self.origin} -> {self.dest}) at \${self.fare:.2f}")
            return True
        print(f"❌ Ride full! Cannot book {rider}")
        return False

if __name__ == "__main__":
    ride = CarpoolOffer("Sarah", "SF", "San Jose", seats=1, fare=15.0)
    ride.book_seat("Dave")
    ride.book_seat("Emma")`
};

let count = 0;
lldData.forEach((q) => {
  if (batch3[q.slug]) {
    q.languages = batch3[q.slug];
    count++;
  }
});

fs.writeFileSync(lldPath, JSON.stringify(lldData, null, 2), "utf-8");
console.log(`Successfully updated batch 3: ${count} questions.`);
