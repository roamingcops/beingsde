"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Cpu,
  BookOpen,
  CheckCircle2,
  Zap,
  AlertTriangle,
  Code2,
  Boxes,
} from "lucide-react";

interface LLDQuestion {
  id: number;
  title: string;
  tag: string;
  difficulty: "Medium" | "Hard";
  patterns: string[];
  summary: string;
  requirements: string[];
  classes: string[];
  codeSkeleton: string;
  approach: string;
}

const lldQuestions: LLDQuestion[] = [
  {
    id: 1,
    title: "Design a Parking Lot System",
    tag: "Object-Oriented Design",
    difficulty: "Medium",
    patterns: ["Singleton", "Factory Method"],
    summary: "Design a multi-level parking lot that can accommodate different vehicle types, handle ticketing, and process billing dynamically.",
    requirements: [
      "Support multiple floors and spot types (Compact, Large, Motorcycle).",
      "Process vehicle check-in (issue ticket, assign spot) and check-out (compute fee, release spot).",
      "Thread-safe singleton control for the main ParkingLot instance.",
      "Support dynamic fare calculation based on hour counts and vehicle types."
    ],
    classes: [
      "ParkingLot (Singleton)",
      "ParkingFloor (List of Spots)",
      "ParkingSpot (Base class for CompactSpot, LargeSpot, etc.)",
      "Vehicle (Base class for Car, Motorcycle, Truck)",
      "ParkingTicket (Tracks entry/exit times and spot references)"
    ],
    codeSkeleton: `// Java Code Skeleton for Parking Lot
public enum VehicleType { CAR, MOTORCYCLE, TRUCK }

public abstract class Vehicle {
    private String licensePlate;
    private VehicleType type;
    public Vehicle(String licensePlate, VehicleType type) {
        this.licensePlate = licensePlate;
        this.type = type;
    }
    public VehicleType getType() { return type; }
}

public class Car extends Vehicle {
    public Car(String licensePlate) { super(licensePlate, VehicleType.CAR); }
}

public class ParkingSpot {
    private int id;
    private boolean isFree = true;
    private VehicleType supportedType;

    public boolean canFit(Vehicle v) { return v.getType() == supportedType; }
    public synchronized void park(Vehicle v) { isFree = false; }
    public synchronized void release() { isFree = true; }
}

public class ParkingLot {
    private static ParkingLot instance;
    private List<ParkingFloor> floors;

    private ParkingLot() { floors = new ArrayList<>(); }
    
    public static synchronized ParkingLot getInstance() {
        if (instance == null) {
            instance = new ParkingLot();
        }
        return instance;
    }

    public synchronized boolean parkVehicle(Vehicle v) {
        for (ParkingFloor floor : floors) {
            if (floor.park(v)) return true;
        }
        return false;
    }
}`,
    approach: "Define a clean class hierarchy for Vehicles and ParkingSpots. Ensure concurrency control on spot allocation (synchronized methods) so multiple gates don't double-book the same physical spot."
  },
  {
    id: 2,
    title: "Design an Elevator System",
    tag: "System Design / State",
    difficulty: "Hard",
    patterns: ["State", "Strategy (Dispatching)"],
    summary: "Design a controller for a bank of elevators optimizing request handling, speed, and energy across multiple floors.",
    requirements: [
      "Elevators must go Up, Down, or stay Idle.",
      "Dispatch algorithm should pick the optimal elevator for internal and external requests.",
      "Handle state transitions cleanly (doors opening, closing, moving, emergency stops).",
      "Support request queues with direction optimization (e.g. SCAN algorithm)."
    ],
    classes: [
      "ElevatorController (Manages multiple cars)",
      "ElevatorCar (Current state, floor, direction)",
      "Request (Source floor, target floor, direction)",
      "ElevatorState (Interface for IdleState, MovingState, StoppedState)"
    ],
    codeSkeleton: `// Java Code Skeleton for Elevator System
public enum Direction { UP, DOWN, IDLE }

public interface ElevatorState {
    void handleRequest(ElevatorCar car, int floor);
}

public class IdleState implements ElevatorState {
    public void handleRequest(ElevatorCar car, int floor) {
        car.setTargetFloor(floor);
        car.setDirection(floor > car.getCurrentFloor() ? Direction.UP : Direction.DOWN);
        car.setState(new MovingState());
    }
}

public class ElevatorCar {
    private int id;
    private int currentFloor = 0;
    private Direction direction = Direction.IDLE;
    private ElevatorState state = new IdleState();
    private TreeSet<Integer> upQueue = new TreeSet<>();
    private TreeSet<Integer> downQueue = new TreeSet<>(Collections.reverseOrder());

    public void processRequest(int floor) {
        state.handleRequest(this, floor);
    }
    public void setState(ElevatorState state) { this.state = state; }
    // Getters and Setters...
}

public class ElevatorController {
    private List<ElevatorCar> elevators;
    
    public void dispatch(Request req) {
        // Find best elevator using distance, direction, and current load
        ElevatorCar optimalCar = findBestCar(req);
        optimalCar.processRequest(req.getTargetFloor());
    }
}`,
    approach: "Use the State pattern to decouple direction & floor transition logics from the main Elevator class. Maintain separate sorted sets (upQueue and downQueue) for SCAN-based request handling."
  },
  {
    id: 3,
    title: "Design BookMyShow (Movie Ticket Booking)",
    tag: "Concurrency / Transactional",
    difficulty: "Hard",
    patterns: ["Observer", "Strategy"],
    summary: "Design a movie ticket booking platform handling massive concurrent seat selection, payments, and notifications.",
    requirements: [
      "Allow users to browse shows in specific theaters.",
      "Ensure seat allocation is highly concurrent: lock seat temporarily (e.g., 5 mins) during payment checkout.",
      "Release seat locks if checkout session expires or payment fails.",
      "Support multiple payment gateways."
    ],
    classes: [
      "Theater & Screen",
      "Show (Movie, Screen, timings)",
      "Seat (Gold, Silver, status: FREE, LOCKED, BOOKED)",
      "Booking (Seat references, User, Show, Status)"
    ],
    codeSkeleton: `// Java Code Skeleton for Movie Ticket Booking
public enum SeatStatus { FREE, LOCKED, BOOKED }

public class Seat {
    private String seatId;
    private SeatStatus status = SeatStatus.FREE;
    private Long lockTimestamp;

    public synchronized boolean lockSeat() {
        if (status == SeatStatus.FREE) {
            status = SeatStatus.LOCKED;
            lockTimestamp = System.currentTimeMillis();
            return true;
        }
        return false;
    }

    public synchronized void releaseSeat() {
        if (status == SeatStatus.LOCKED) {
            status = SeatStatus.FREE;
            lockTimestamp = null;
        }
    }

    public synchronized void bookSeat() {
        if (status == SeatStatus.LOCKED) {
            status = SeatStatus.BOOKED;
        }
    }
}

public class Show {
    private String id;
    private Movie movie;
    private List<Seat> seats;

    public List<Seat> getAvailableSeats() {
        List<Seat> freeSeats = new ArrayList<>();
        for (Seat seat : seats) {
            // Drop expired locks during lookup
            if (seat.isLockExpired()) seat.releaseSeat();
            if (seat.getStatus() == SeatStatus.FREE) freeSeats.add(seat);
        }
        return freeSeats;
    }
}`,
    approach: "Implement optimistic or pessimistic locking on seats to prevent double booking. Use a Redis-based cache to store temporary seat locks with TTLs (Time-To-Live) corresponding to payment checkout timers."
  },
  {
    id: 4,
    title: "Design Splitwise (Expense Sharing App)",
    tag: "Object-Oriented Design",
    difficulty: "Medium",
    patterns: ["Strategy", "Factory"],
    summary: "Design Splitwise to add expenses, share balances among friends, and optimize debt simplification.",
    requirements: [
      "Users can log group expenses split equally, unequally, or by percentages.",
      "Automatically compute balances between users.",
      "Provide a debt-simplification algorithm (minimize transactions between members)."
    ],
    classes: [
      "User (Name, Email, Balance Sheet)",
      "Expense (Base class for EqualExpense, UnequalExpense)",
      "Split (Maps User to split amount)",
      "Group (Tracks users and expenses list)"
    ],
    codeSkeleton: `// Java Code Skeleton for Splitwise Balance Sheet
public abstract class Expense {
    private String id;
    private User paidBy;
    private double totalAmount;
    private List<Split> splits;

    public abstract boolean validate();
}

public class EqualExpense extends Expense {
    public boolean validate() {
        double splitAmount = getTotalAmount() / getSplits().size();
        for (Split split : getSplits()) {
            if (Math.abs(split.getAmount() - splitAmount) > 0.01) return false;
        }
        return true;
    }
}

public class BalanceSheet {
    // Map of User -> Net Balance (Positive means they are owed money, negative means they owe)
    private Map<User, Double> balances = new HashMap<>();

    public void updateBalance(User debtor, User creditor, double amount) {
        balances.put(debtor, balances.getOrDefault(debtor, 0.0) - amount);
        balances.put(creditor, balances.getOrDefault(creditor, 0.0) + amount);
    }
}`,
    approach: "Compute net balance sheets for all users. Run a greedy optimization algorithm (using a Min Heap for debtors and a Max Heap for creditors) to iteratively settle the largest debts, minimizing the total number of transactions."
  },
  {
    id: 5,
    title: "Design a Vending Machine",
    tag: "State Pattern / Behavioral",
    difficulty: "Medium",
    patterns: ["State"],
    summary: "Design a Vending Machine that transitions cleanly between states: Idle, Waiting for Coins, Dispensing, Out of Stock.",
    requirements: [
      "Display items with prices and quantities.",
      "Accept coins/cash inputs, calculate balance, and return change.",
      "Ensure transaction safety: don't release items unless funds are confirmed."
    ],
    classes: [
      "VendingMachine (Context class)",
      "State (Interface with selectProduct, insertCoin, pressButton, dispense)",
      "IdleState, HasMoneyState, DispensingState, SoldOutState (Concrete states)",
      "Inventory & Product"
    ],
    codeSkeleton: `// Java Code Skeleton for Vending Machine State Transitions
public interface State {
    void insertCoin(VendingMachine machine, double amount);
    void selectProduct(VendingMachine machine, String code);
    void dispense(VendingMachine machine);
}

public class IdleState implements State {
    public void insertCoin(VendingMachine machine, double amount) {
        machine.addBalance(amount);
        machine.setState(new HasMoneyState());
    }
    public void selectProduct(VendingMachine machine, String code) {
        System.out.println("Insert coin first.");
    }
    public void dispense(VendingMachine machine) {
        System.out.println("Nothing selected.");
    }
}

public class VendingMachine {
    private State currentState = new IdleState();
    private double balance = 0.0;
    private Inventory inventory;

    public void setState(State state) { this.currentState = state; }
    public void addBalance(double amount) { this.balance += amount; }
    public void selectProduct(String code) { currentState.selectProduct(this, code); }
    public void dispense() { currentState.dispense(this); }
}`,
    approach: "Use the State pattern to represent machine phases. The context object (VendingMachine) delegates all action calls to the current state object, which controls state changes based on logic rules."
  },
  {
    id: 6,
    title: "Design Snake & Ladder Game",
    tag: "OOD / Game",
    difficulty: "Medium",
    patterns: ["Singleton"],
    summary: "Design a modular Snake and Ladder board game supporting multiple players and custom board dimensions.",
    requirements: [
      "Board contains Snakes and Ladders at randomized positions.",
      "Process turns iteratively using a dice (1-6 rolls).",
      "Winning condition: Player lands exactly on slot 100."
    ],
    classes: [
      "Board (Grid of BoardCells)",
      "BoardCell (Contains optional Snake or Ladder pointer)",
      "Player (Tracks current index position)",
      "Dice (Generates random values in [1, 6])",
      "Game (Engine loop routing turns)"
    ],
    codeSkeleton: `// Java Code Skeleton for Snake and Ladder Game Engine
public class BoardCell {
    private int position;
    private int nextDestination; // Set different from position for snakes/ladders

    public BoardCell(int position) {
        this.position = position;
        this.nextDestination = position;
    }
    public int getDestination() { return nextDestination; }
    public void setJumpDestination(int dest) { this.nextDestination = dest; }
}

public class Game {
    private Board board;
    private Queue<Player> players;
    private Dice dice;

    public void playTurn() {
        Player currentPlayer = players.poll();
        int roll = dice.roll();
        int target = currentPlayer.getPosition() + roll;

        if (target <= 100) {
            BoardCell cell = board.getCell(target);
            currentPlayer.setPosition(cell.getDestination());
        }

        if (currentPlayer.getPosition() == 100) {
            System.out.println(currentPlayer.getName() + " wins!");
            return;
        }
        players.offer(currentPlayer); // Put back to the end of the queue
    }
}`,
    approach: "Use a Queue to manage player turn sequences. Model snakes and ladders as jumping destinations on `BoardCell` nodes to keep board rendering and trajectory computation decoupled."
  },
  {
    id: 7,
    title: "Design Chess Game",
    tag: "OOD / Game",
    difficulty: "Hard",
    patterns: ["Factory Method", "Command"],
    summary: "Design a chess engine supporting pieces behavior, move validations, board states, checkmate rules, and move rollbacks.",
    requirements: [
      "White and Black players execute turn-based moves.",
      "Pieces (King, Queen, Pawn) validate their legal trajectories.",
      "Checkmate/stalemate validation algorithms.",
      "Support transaction history/undo moves."
    ],
    classes: [
      "Board (8x8 grid of Cells)",
      "Cell (Tracks Row, Column, and current Piece)",
      "Piece (Base class defining getLegalMoves)",
      "Move (Tracks start and end Cells, capturing history)",
      "Game (Manages turn history, game status)"
    ],
    codeSkeleton: `// Java Code Skeleton for Chess Piece Hierarchy
public abstract class Piece {
    private boolean isWhite;
    public Piece(boolean isWhite) { this.isWhite = isWhite; }
    public boolean isWhite() { return isWhite; }
    
    public abstract boolean canMove(Board board, Cell start, Cell end);
}

public class Knight extends Piece {
    public Knight(boolean isWhite) { super(isWhite); }
    public boolean canMove(Board board, Cell start, Cell end) {
        int x = Math.abs(start.getX() - end.getX());
        int y = Math.abs(start.getY() - end.getY());
        return x * y == 2; // Knight movement multiplier (2x1 L-shape)
    }
}

public class Move {
    private Player player;
    private Cell start;
    private Cell end;
    private Piece pieceMoved;
    private Piece pieceKilled;

    public Move(Player p, Cell start, Cell end) {
        this.player = p;
        this.start = start;
        this.end = end;
        this.pieceMoved = start.getPiece();
    }
}`,
    approach: "Model Chess pieces by subclassing a base `Piece` class with custom `canMove` rules. Use the Command pattern for `Move` objects to support action validation, turn logs, and undo actions."
  }
];

export default function LldPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = lldQuestions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.patterns.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.tag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === "ALL" || q.difficulty.toUpperCase() === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Boxes className="w-5 h-5 text-zinc-400" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">OOD / LLD practice</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50 mb-2">
          Low-Level Design Exercises
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
          Standard object-oriented design problems curated to help you master class structures, design patterns, and thread-safe implementations.
        </p>

        {/* Stats */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">7</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Standard Problems</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">Java</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Code Blueprints</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by title, pattern, or class..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setExpandedId(null);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 rounded-sm transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Difficulty:</span>
          {["ALL", "MEDIUM", "HARD"].map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setSelectedDifficulty(diff);
                setExpandedId(null);
              }}
              className={`text-2xs font-semibold px-3 py-1.5 border uppercase tracking-wider transition-all duration-300 ${
                selectedDifficulty === diff
                  ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                  : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Subtitle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Catalog Index</span>
        <span className="text-xs text-zinc-400 font-mono">{filtered.length} design templates</span>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-sm p-3 mb-6">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Click on any system design exercise to explore its structural class requirements, design patterns, and code skeletons.
        </p>
      </div>

      {/* Questions List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No LLD designs match your current filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDifficulty("ALL");
            }}
            className="mt-2 text-xs underline text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q, idx) => {
            const expanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className={`border rounded-sm transition-all duration-200 ${
                  expanded
                    ? "border-zinc-400 dark:border-zinc-600 shadow-md"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                } bg-white dark:bg-[#18181b]`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(expanded ? null : q.id)}
                  className="w-full text-left px-5 py-4 flex items-start gap-3 group"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        {q.tag}
                      </span>
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                          q.difficulty === "Medium"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      {q.patterns.map((p) => (
                        <span
                          key={p}
                          className="inline-block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 border border-zinc-250 dark:border-zinc-800 px-1.5 py-0.5 rounded-sm"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {q.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 group-hover:line-clamp-none">
                      {q.summary}
                    </p>
                  </div>

                  <span className="flex-shrink-0 text-zinc-400 dark:text-zinc-500 mt-1">
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {/* Expanded Content */}
                {expanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                    {/* Requirements */}
                    <div>
                      <p className="text-[10px] font-black font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                        Functional Constraints & Scope
                      </p>
                      <ul className="space-y-1.5">
                        {q.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Core Classes */}
                    <div>
                      <p className="text-[10px] font-black font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                        Core Classes & Models
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {q.classes.map((cls) => (
                          <span
                            key={cls}
                            className="bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs px-2.5 py-1 rounded-sm border border-zinc-200 dark:border-zinc-800 font-mono"
                          >
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Java Code Blueprint */}
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                        <Code2 className="w-3.5 h-3.5" /> Java Implementation Skeleton
                      </div>
                      <pre className="bg-zinc-950 text-zinc-100 text-xs p-4 rounded-sm font-mono overflow-x-auto border border-zinc-800 leading-relaxed max-h-96">
                        <code>{q.codeSkeleton}</code>
                      </pre>
                    </div>

                    {/* Approach & Pitfalls */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm p-3.5">
                      <p className="text-[10px] font-black font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
                        Design Approach & Concurrency Notes
                      </p>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {q.approach}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-zinc-400" />
          <p className="text-xs text-zinc-400 font-mono">
            Low-Level Design topics cover OOP principles (Abstraction, Polymorphism) and Creational, Structural, and Behavioral Gang of Four (GoF) patterns.
          </p>
        </div>
      </div>
    </div>
  );
}
