const fs = require("fs");
const path = require("path");

const lldPath = path.resolve(__dirname, "../../beingsde-ui/src/data/lld.json");
const lldData = JSON.parse(fs.readFileSync(lldPath, "utf-8"));

const batch1 = {};

// ─────────────────────────────────────────────────────────────
// 1. TIC TAC TOE
// ─────────────────────────────────────────────────────────────
batch1["tic-tac-toe"] = {
  java: `import java.util.*;

enum Symbol { X, O, EMPTY }

class Cell {
    private final int row, col;
    private Symbol symbol;

    public Cell(int row, int col) {
        this.row = row;
        this.col = col;
        this.symbol = Symbol.EMPTY;
    }
    public boolean isEmpty() { return symbol == Symbol.EMPTY; }
    public Symbol getSymbol() { return symbol; }
    public void setSymbol(Symbol symbol) { this.symbol = symbol; }
}

class Board {
    private final int size;
    private final Cell[][] grid;

    public Board(int size) {
        this.size = size;
        this.grid = new Cell[size][size];
        for (int r = 0; r < size; r++) {
            for (int c = 0; c < size; c++) {
                grid[r][c] = new Cell(r, c);
            }
        }
    }

    public boolean placeSymbol(int r, int c, Symbol s) {
        if (r < 0 || r >= size || c < 0 || c >= size || !grid[r][c].isEmpty()) return false;
        grid[r][c].setSymbol(s);
        return true;
    }

    public void printBoard() {
        System.out.println("-------------");
        for (int r = 0; r < size; r++) {
            System.out.print("| ");
            for (int c = 0; c < size; c++) {
                char ch = grid[r][c].getSymbol() == Symbol.EMPTY ? ' ' : grid[r][c].getSymbol().name().charAt(0);
                System.out.print(ch + " | ");
            }
            System.out.println("\\n-------------");
        }
    }

    public int getSize() { return size; }
}

class Player {
    private final String name;
    private final Symbol symbol;

    public Player(String name, Symbol symbol) {
        this.name = name;
        this.symbol = symbol;
    }
    public String getName() { return name; }
    public Symbol getSymbol() { return symbol; }
}

class TicTacToeGame {
    private final Board board;
    private final Queue<Player> players = new LinkedList<>();
    private final int[] rowCounts, colCounts;
    private int diagCount = 0, antiDiagCount = 0;
    private int movesMade = 0;
    private boolean isGameOver = false;

    public TicTacToeGame(int size, Player p1, Player p2) {
        this.board = new Board(size);
        this.players.add(p1);
        this.players.add(p2);
        this.rowCounts = new int[size];
        this.colCounts = new int[size];
    }

    public boolean makeMove(int r, int c) {
        if (isGameOver) {
            System.out.println("Game is already finished!");
            return false;
        }

        Player current = players.peek();
        if (!board.placeSymbol(r, c, current.getSymbol())) {
            System.out.println("Invalid move at (" + r + ", " + c + "). Cell occupied or out of bounds.");
            return false;
        }

        movesMade++;
        int val = (current.getSymbol() == Symbol.X) ? 1 : -1;
        rowCounts[r] += val;
        colCounts[c] += val;
        if (r == c) diagCount += val;
        if (r + c == board.getSize() - 1) antiDiagCount += val;

        board.printBoard();

        int target = board.getSize();
        if (Math.abs(rowCounts[r]) == target || Math.abs(colCounts[c]) == target ||
            Math.abs(diagCount) == target || Math.abs(antiDiagCount) == target) {
            System.out.println("🎉 Player " + current.getName() + " (" + current.getSymbol() + ") WINS!");
            isGameOver = true;
            return true;
        }

        if (movesMade == target * target) {
            System.out.println("🤝 It's a DRAW!");
            isGameOver = true;
            return true;
        }

        players.poll();
        players.add(current);
        return true;
    }
}

public class Main {
    public static void main(String[] args) {
        Player alice = new Player("Alice", Symbol.X);
        Player bob = new Player("Bob", Symbol.O);
        TicTacToeGame game = new TicTacToeGame(3, alice, bob);

        System.out.println("--- Starting Tic Tac Toe Simulation ---");
        game.makeMove(0, 0); // Alice X
        game.makeMove(0, 1); // Bob O
        game.makeMove(1, 1); // Alice X
        game.makeMove(0, 2); // Bob O
        game.makeMove(2, 2); // Alice X wins diagonal
    }
}`,
  cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <cmath>

enum class Symbol { EMPTY, X, O };

class Cell {
    int r, c;
    Symbol symbol;
public:
    Cell(int r = 0, int c = 0) : r(r), c(c), symbol(Symbol::EMPTY) {}
    bool isEmpty() const { return symbol == Symbol::EMPTY; }
    Symbol getSymbol() const { return symbol; }
    void setSymbol(Symbol s) { symbol = s; }
};

class Board {
    int size;
    std::vector<std::vector<Cell>> grid;
public:
    Board(int s) : size(s), grid(s, std::vector<Cell>(s)) {
        for (int i = 0; i < s; i++)
            for (int j = 0; j < s; j++)
                grid[i][j] = Cell(i, j);
    }
    bool place(int r, int c, Symbol s) {
        if (r < 0 || r >= size || c < 0 || c >= size || !grid[r][c].isEmpty()) return false;
        grid[r][c].setSymbol(s);
        return true;
    }
    void print() const {
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                char ch = grid[i][j].getSymbol() == Symbol::EMPTY ? '.' :
                          (grid[i][j].getSymbol() == Symbol::X ? 'X' : 'O');
                std::cout << ch << " ";
            }
            std::cout << "\\n";
        }
        std::cout << "---\\n";
    }
    int getSize() const { return size; }
};

struct Player {
    std::string name;
    Symbol symbol;
};

class TicTacToeGame {
    Board board;
    std::queue<Player> players;
    std::vector<int> rows, cols;
    int diag = 0, antiDiag = 0, moves = 0;
    bool gameOver = false;
public:
    TicTacToeGame(int s, Player p1, Player p2) : board(s), rows(s, 0), cols(s, 0) {
        players.push(p1);
        players.push(p2);
    }

    bool makeMove(int r, int c) {
        if (gameOver) return false;
        Player curr = players.front();
        if (!board.place(r, c, curr.symbol)) return false;

        moves++;
        int val = (curr.symbol == Symbol::X) ? 1 : -1;
        rows[r] += val;
        cols[c] += val;
        if (r == c) diag += val;
        if (r + c == board.getSize() - 1) antiDiag += val;

        board.print();

        int target = board.getSize();
        if (std::abs(rows[r]) == target || std::abs(cols[c]) == target ||
            std::abs(diag) == target || std::abs(antiDiag) == target) {
            std::cout << "Player " << curr.name << " WINS!\\n";
            gameOver = true;
            return true;
        }
        if (moves == target * target) {
            std::cout << "Draw game!\\n";
            gameOver = true;
            return true;
        }

        players.pop();
        players.push(curr);
        return true;
    }
};

int main() {
    Player p1{"Alice", Symbol::X};
    Player p2{"Bob", Symbol::O};
    TicTacToeGame game(3, p1, p2);
    game.makeMove(0, 0);
    game.makeMove(0, 1);
    game.makeMove(1, 1);
    game.makeMove(0, 2);
    game.makeMove(2, 2);
    return 0;
}`,
  python: `from collections import deque
from enum import Enum

class Symbol(Enum):
    EMPTY = "."
    X = "X"
    O = "O"

class Board:
    def __init__(self, size: int):
        self.size = size
        self.grid = [[Symbol.EMPTY for _ in range(size)] for _ in range(size)]

    def place(self, r: int, c: int, symbol: Symbol) -> bool:
        if not (0 <= r < self.size and 0 <= c < self.size) or self.grid[r][c] != Symbol.EMPTY:
            return False
        self.grid[r][c] = symbol
        return True

    def display(self):
        for row in self.grid:
            print(" ".join(c.value for c in row))
        print("---")

class TicTacToeGame:
    def __init__(self, size: int, p1_name: str, p2_name: str):
        self.board = Board(size)
        self.players = deque([
            {"name": p1_name, "symbol": Symbol.X},
            {"name": p2_name, "symbol": Symbol.O}
        ])
        self.rows = [0] * size
        self.cols = [0] * size
        self.diag = 0
        self.anti_diag = 0
        self.moves = 0
        self.game_over = False

    def make_move(self, r: int, c: int) -> bool:
        if self.game_over:
            return False
        curr = self.players[0]
        if not self.board.place(r, c, curr["symbol"]):
            return False

        self.moves += 1
        val = 1 if curr["symbol"] == Symbol.X else -1
        self.rows[r] += val
        self.cols[c] += val
        if r == c:
            self.diag += val
        if r + c == self.board.size - 1:
            self.anti_diag += val

        self.board.display()

        target = self.board.size
        if any(abs(x) == target for x in [self.rows[r], self.cols[c], self.diag, self.anti_diag]):
            print(f"🎉 {curr['name']} ({curr['symbol'].value}) WINS!")
            self.game_over = True
            return True

        if self.moves == target * target:
            print("🤝 DRAW Game!")
            self.game_over = True
            return True

        self.players.rotate(-1)
        return True

if __name__ == "__main__":
    game = TicTacToeGame(3, "Alice", "Bob")
    moves = [(0, 0), (0, 1), (1, 1), (0, 2), (2, 2)]
    for r, c in moves:
        game.make_move(r, c)`
};

// ─────────────────────────────────────────────────────────────
// 2. TRAFFIC SIGNAL
// ─────────────────────────────────────────────────────────────
batch1["traffic-signal"] = {
  java: `import java.util.*;

enum SignalColor { RED, YELLOW, GREEN }

interface SignalState {
    void handle(TrafficSignal signal);
    SignalColor getColor();
}

class RedState implements SignalState {
    public void handle(TrafficSignal signal) {
        signal.setState(new GreenState(), signal.getGreenDuration());
    }
    public SignalColor getColor() { return SignalColor.RED; }
}

class GreenState implements SignalState {
    public void handle(TrafficSignal signal) {
        signal.setState(new YellowState(), signal.getYellowDuration());
    }
    public SignalColor getColor() { return SignalColor.GREEN; }
}

class YellowState implements SignalState {
    public void handle(TrafficSignal signal) {
        signal.setState(new RedState(), signal.getRedDuration());
    }
    public SignalColor getColor() { return SignalColor.YELLOW; }
}

class TrafficSignal {
    private final String id;
    private SignalState state;
    private int durationSeconds;
    private final int redDuration, yellowDuration, greenDuration;

    public TrafficSignal(String id, int red, int yellow, int green) {
        this.id = id;
        this.redDuration = red;
        this.yellowDuration = yellow;
        this.greenDuration = green;
        this.state = new RedState();
        this.durationSeconds = red;
    }

    public void setState(SignalState state, int duration) {
        this.state = state;
        this.durationSeconds = duration;
        System.out.println("🚦 Signal [" + id + "] transitioned to " + state.getColor() + " for " + duration + "s");
    }

    public void triggerCycle() {
        state.handle(this);
    }

    public void emergencyOverride() {
        System.out.println("🚨 EMERGENCY OVERRIDE triggered on Signal [" + id + "] -> immediate GREEN");
        setState(new GreenState(), 60);
    }

    public String getId() { return id; }
    public SignalColor getCurrentColor() { return state.getColor(); }
    public int getRedDuration() { return redDuration; }
    public int getYellowDuration() { return yellowDuration; }
    public int getGreenDuration() { return greenDuration; }
}

class IntersectionController {
    private final Map<String, TrafficSignal> signals = new LinkedHashMap<>();

    public void addSignal(TrafficSignal signal) {
        signals.put(signal.getId(), signal);
    }

    public void simulateStep() {
        System.out.println("\\n--- Simulating Intersection Signal Change ---");
        for (TrafficSignal s : signals.values()) {
            s.triggerCycle();
        }
    }
}

public class Main {
    public static void main(String[] args) {
        IntersectionController intersection = new IntersectionController();
        TrafficSignal northSouth = new TrafficSignal("North-South", 30, 5, 25);
        TrafficSignal eastWest = new TrafficSignal("East-West", 25, 5, 30);

        intersection.addSignal(northSouth);
        intersection.addSignal(eastWest);

        intersection.simulateStep();
        intersection.simulateStep();
        northSouth.emergencyOverride();
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <memory>
#include <vector>

enum class SignalColor { RED, YELLOW, GREEN };

class TrafficSignal;

class SignalState {
public:
    virtual ~SignalState() = default;
    virtual void handle(TrafficSignal& signal) = 0;
    virtual SignalColor getColor() const = 0;
    virtual std::string toString() const = 0;
};

class RedState : public SignalState {
public:
    void handle(TrafficSignal& signal) override;
    SignalColor getColor() const override { return SignalColor::RED; }
    std::string toString() const override { return "RED"; }
};

class GreenState : public SignalState {
public:
    void handle(TrafficSignal& signal) override;
    SignalColor getColor() const override { return SignalColor::GREEN; }
    std::string toString() const override { return "GREEN"; }
};

class YellowState : public SignalState {
public:
    void handle(TrafficSignal& signal) override;
    SignalColor getColor() const override { return SignalColor::YELLOW; }
    std::string toString() const override { return "YELLOW"; }
};

class TrafficSignal {
    std::string id;
    std::unique_ptr<SignalState> state;
    int redDur, yellowDur, greenDur;
public:
    TrafficSignal(std::string id, int r, int y, int g)
        : id(std::move(id)), redDur(r), yellowDur(y), greenDur(g), state(std::make_unique<RedState>()) {}

    void setState(std::unique_ptr<SignalState> newState) {
        state = std::move(newState);
        std::cout << "Signal [" << id << "] is now " << state->toString() << "\\n";
    }

    void cycle() { state->handle(*this); }
    void emergencyGreen() { setState(std::make_unique<GreenState>()); }
};

void RedState::handle(TrafficSignal& s) { s.setState(std::make_unique<GreenState>()); }
void GreenState::handle(TrafficSignal& s) { s.setState(std::make_unique<YellowState>()); }
void YellowState::handle(TrafficSignal& s) { s.setState(std::make_unique<RedState>()); }

int main() {
    TrafficSignal sig("MainSt_4thAve", 30, 5, 25);
    sig.cycle();
    sig.cycle();
    sig.emergencyGreen();
    return 0;
}`,
  python: `from enum import Enum
from abc import ABC, abstractmethod

class SignalColor(Enum):
    RED = "RED"
    YELLOW = "YELLOW"
    GREEN = "GREEN"

class SignalState(ABC):
    @abstractmethod
    def handle(self, signal: 'TrafficSignal'):
        pass

    @property
    @abstractmethod
    def color(self) -> SignalColor:
        pass

class RedState(SignalState):
    def handle(self, signal: 'TrafficSignal'):
        signal.set_state(GreenState(), signal.green_duration)
    @property
    def color(self): return SignalColor.RED

class GreenState(SignalState):
    def handle(self, signal: 'TrafficSignal'):
        signal.set_state(YellowState(), signal.yellow_duration)
    @property
    def color(self): return SignalColor.GREEN

class YellowState(SignalState):
    def handle(self, signal: 'TrafficSignal'):
        signal.set_state(RedState(), signal.red_duration)
    @property
    def color(self): return SignalColor.YELLOW

class TrafficSignal:
    def __init__(self, signal_id: str, red: int = 30, yellow: int = 5, green: int = 25):
        self.id = signal_id
        self.red_duration = red
        self.yellow_duration = yellow
        self.green_duration = green
        self.state: SignalState = RedState()
        self.duration = red

    def set_state(self, new_state: SignalState, duration: int):
        self.state = new_state
        self.duration = duration
        print(f"🚦 Signal [{self.id}] switched to {self.state.color.value} ({duration}s)")

    def trigger_cycle(self):
        self.state.handle(self)

    def emergency_override(self):
        print(f"🚨 EMERGENCY on [{self.id}]: Forcing GREEN")
        self.set_state(GreenState(), 60)

if __name__ == "__main__":
    signal = TrafficSignal("Intersection-A", red=30, yellow=5, green=25)
    signal.trigger_cycle()
    signal.trigger_cycle()
    signal.emergency_override()`
};

// ─────────────────────────────────────────────────────────────
// 3. CHESS CLOCK
// ─────────────────────────────────────────────────────────────
batch1["chess-clock"] = {
  java: `public class Main {
    enum ClockState { RUNNING, PAUSED, FLAGGED }

    static class PlayerClock {
        private final String playerName;
        private long remainingMillis;
        private final long incrementMillis;

        public PlayerClock(String name, long initialMinutes, long incrementSeconds) {
            this.playerName = name;
            this.remainingMillis = initialMinutes * 60 * 1000;
            this.incrementMillis = incrementSeconds * 1000;
        }

        public void deductTime(long millis) {
            this.remainingMillis = Math.max(0, this.remainingMillis - millis);
        }

        public void applyIncrement() {
            this.remainingMillis += incrementMillis;
        }

        public boolean isFlagged() { return remainingMillis <= 0; }
        public String getPlayerName() { return playerName; }
        public String getFormattedTime() {
            long totalSec = remainingMillis / 1000;
            return String.format("%02d:%02d", totalSec / 60, totalSec % 60);
        }
    }

    static class ChessClock {
        private final PlayerClock whiteClock;
        private final PlayerClock blackClock;
        private PlayerClock activeClock;
        private ClockState state;
        private long lastTickTimestamp;

        public ChessClock(String whitePlayer, String blackPlayer, long mins, long incSec) {
            this.whiteClock = new PlayerClock(whitePlayer, mins, incSec);
            this.blackClock = new PlayerClock(blackPlayer, mins, incSec);
            this.activeClock = whiteClock;
            this.state = ClockState.PAUSED;
        }

        public void start() {
            this.state = ClockState.RUNNING;
            this.lastTickTimestamp = System.currentTimeMillis();
            System.out.println("⏱️ Clock Started. Active: " + activeClock.getPlayerName());
        }

        public void pressClock() {
            if (state != ClockState.RUNNING) return;
            tick();
            activeClock.applyIncrement();
            System.out.println("👉 " + activeClock.getPlayerName() + " pressed clock. Remaining: " + activeClock.getFormattedTime());

            activeClock = (activeClock == whiteClock) ? blackClock : whiteClock;
            lastTickTimestamp = System.currentTimeMillis();
            System.out.println("Turn passed to: " + activeClock.getPlayerName());
        }

        public void tick() {
            if (state != ClockState.RUNNING) return;
            long now = System.currentTimeMillis();
            long elapsed = now - lastTickTimestamp;
            activeClock.deductTime(elapsed);
            lastTickTimestamp = now;

            if (activeClock.isFlagged()) {
                state = ClockState.FLAGGED;
                System.out.println("🚩 TIME OUT! " + activeClock.getPlayerName() + " has been flagged!");
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        ChessClock clock = new ChessClock("Magnus", "Hikaru", 3, 2);
        clock.start();
        Thread.sleep(1500); // 1.5s simulated turn
        clock.pressClock();
        Thread.sleep(2000); // 2s simulated turn
        clock.pressClock();
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <chrono>
#include <thread>
#include <iomanip>

class PlayerClock {
    std::string name;
    long long remainingMs;
    long long incMs;
public:
    PlayerClock(std::string n, int mins, int incSec)
        : name(std::move(n)), remainingMs(mins * 60 * 1000LL), incMs(incSec * 1000LL) {}

    void deduct(long long ms) { remainingMs = std::max(0LL, remainingMs - ms); }
    void addIncrement() { remainingMs += incMs; }
    bool isExpired() const { return remainingMs <= 0; }
    std::string getName() const { return name; }
    std::string getTimeStr() const {
        long long s = remainingMs / 1000;
        return std::to_string(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + std::to_string(s % 60);
    }
};

class ChessClock {
    PlayerClock white, black;
    PlayerClock* active;
    bool running = false;
    std::chrono::steady_clock::time_point lastTick;
public:
    ChessClock(std::string w, std::string b, int mins, int inc)
        : white(w, mins, inc), black(b, mins, inc), active(&white) {}

    void start() {
        running = true;
        lastTick = std::chrono::steady_clock::now();
        std::cout << "Clock started for " << active->getName() << "\\n";
    }

    void press() {
        if (!running) return;
        auto now = std::chrono::steady_clock::now();
        auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(now - lastTick).count();
        active->deduct(elapsed);
        active->addIncrement();
        std::cout << active->getName() << " clock remaining: " << active->getTimeStr() << "\\n";

        active = (active == &white) ? &black : &white;
        lastTick = std::chrono::steady_clock::now();
        std::cout << "Turn -> " << active->getName() << "\\n";
    }
};

int main() {
    ChessClock clock("White", "Black", 3, 2);
    clock.start();
    std::this_thread::sleep_for(std::chrono::milliseconds(500));
    clock.press();
    return 0;
}`,
  python: `import time

class PlayerClock:
    def __init__(self, name: str, minutes: int, increment_sec: int):
        self.name = name
        self.remaining_sec = float(minutes * 60)
        self.increment_sec = float(increment_sec)

    def deduct(self, elapsed: float):
        self.remaining_sec = max(0.0, self.remaining_sec - elapsed)

    def apply_increment(self):
        self.remaining_sec += self.increment_sec

    @property
    def formatted_time(self) -> str:
        s = int(self.remaining_sec)
        return f"{s // 60:02d}:{s % 60:02d}"

class ChessClock:
    def __init__(self, white_name: str, black_name: str, minutes: int = 3, increment_sec: int = 2):
        self.white = PlayerClock(white_name, minutes, increment_sec)
        self.black = PlayerClock(black_name, minutes, increment_sec)
        self.active = self.white
        self.last_timestamp = None

    def start(self):
        self.last_timestamp = time.time()
        print(f"⏱️ Clock started. Active: {self.active.name} ({self.active.formatted_time})")

    def press_clock(self):
        now = time.time()
        elapsed = now - self.last_timestamp
        self.active.deduct(elapsed)
        self.active.apply_increment()
        print(f"👉 {self.active.name} moved. Remaining: {self.active.formatted_time}")

        self.active = self.black if self.active == self.white else self.white
        self.last_timestamp = time.time()
        print(f"Turn -> {self.active.name}")

if __name__ == "__main__":
    clock = ChessClock("Magnus", "Hikaru", 3, 2)
    clock.start()
    time.sleep(0.5)
    clock.press_clock()`
};

// ─────────────────────────────────────────────────────────────
// 4. LOGGER
// ─────────────────────────────────────────────────────────────
batch1["logger"] = {
  java: `import java.time.LocalDateTime;

enum LogLevel {
    DEBUG(1), INFO(2), WARN(3), ERROR(4);
    final int level;
    LogLevel(int level) { this.level = level; }
}

interface LogAppender {
    void append(String message);
}

class ConsoleAppender implements LogAppender {
    public void append(String message) { System.out.println("[CONSOLE] " + message); }
}

class FileAppender implements LogAppender {
    public void append(String message) { System.out.println("[FILE_DISK_WRITE] " + message); }
}

abstract class LogHandler {
    protected LogLevel level;
    protected LogHandler nextHandler;

    public LogHandler(LogLevel level) { this.level = level; }
    public void setNext(LogHandler next) { this.nextHandler = next; }

    public void log(LogLevel lvl, String msg, LogAppender appender) {
        if (lvl.level >= this.level.level) {
            write(lvl, msg, appender);
        }
        if (nextHandler != null) {
            nextHandler.log(lvl, msg, appender);
        }
    }

    protected abstract void write(LogLevel lvl, String msg, LogAppender appender);
}

class InfoLogHandler extends LogHandler {
    public InfoLogHandler() { super(LogLevel.INFO); }
    protected void write(LogLevel lvl, String msg, LogAppender appender) {
        if (lvl == LogLevel.INFO) appender.append(LocalDateTime.now() + " [INFO] " + msg);
    }
}

class ErrorLogHandler extends LogHandler {
    public ErrorLogHandler() { super(LogLevel.ERROR); }
    protected void write(LogLevel lvl, String msg, LogAppender appender) {
        if (lvl == LogLevel.ERROR) appender.append(LocalDateTime.now() + " [ERROR] " + msg);
    }
}

class Logger {
    private static volatile Logger instance;
    private LogHandler chain;
    private LogAppender appender;

    private Logger() {
        LogHandler info = new InfoLogHandler();
        LogHandler error = new ErrorLogHandler();
        info.setNext(error);
        this.chain = info;
        this.appender = new ConsoleAppender();
    }

    public static Logger getInstance() {
        if (instance == null) {
            synchronized (Logger.class) {
                if (instance == null) instance = new Logger();
            }
        }
        return instance;
    }

    public void setAppender(LogAppender appender) { this.appender = appender; }
    public void info(String msg) { chain.log(LogLevel.INFO, msg, appender); }
    public void error(String msg) { chain.log(LogLevel.ERROR, msg, appender); }
}

public class Main {
    public static void main(String[] args) {
        Logger logger = Logger.getInstance();
        logger.info("Application initialized successfully on port 8080");
        logger.error("Database connection failed: Connection timeout to replica 1");
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <memory>

enum class Level { INFO, WARN, ERROR };

class Handler {
protected:
    std::shared_ptr<Handler> next;
public:
    virtual ~Handler() = default;
    void setNext(std::shared_ptr<Handler> n) { next = n; }
    virtual void log(Level lvl, const std::string& msg) {
        if (next) next->log(lvl, msg);
    }
};

class InfoHandler : public Handler {
public:
    void log(Level lvl, const std::string& msg) override {
        if (lvl == Level::INFO) std::cout << "[INFO] " << msg << "\\n";
        else Handler::log(lvl, msg);
    }
};

class ErrorHandler : public Handler {
public:
    void log(Level lvl, const std::string& msg) override {
        if (lvl == Level::ERROR) std::cerr << "[ERROR] " << msg << "\\n";
        else Handler::log(lvl, msg);
    }
};

int main() {
    auto info = std::make_shared<InfoHandler>();
    auto error = std::make_shared<ErrorHandler>();
    info->setNext(error);

    info->log(Level::INFO, "Server started");
    info->log(Level::ERROR, "Disk full on /dev/sda1");
    return 0;
}`,
  python: `from enum import Enum, auto
from abc import ABC, abstractmethod
import datetime

class LogLevel(Enum):
    DEBUG = 1
    INFO = 2
    ERROR = 3

class LogHandler(ABC):
    def __init__(self, level: LogLevel):
        self.level = level
        self.next = None

    def set_next(self, nxt: 'LogHandler'):
        self.next = nxt
        return nxt

    def log(self, level: LogLevel, msg: str):
        if level.value >= self.level.value:
            self.write(level, msg)
        if self.next:
            self.next.log(level, msg)

    @abstractmethod
    def write(self, level: LogLevel, msg: str):
        pass

class InfoHandler(LogHandler):
    def __init__(self): super().__init__(LogLevel.INFO)
    def write(self, level: LogLevel, msg: str):
        if level == LogLevel.INFO:
            print(f"{datetime.datetime.now()} [INFO] {msg}")

class ErrorHandler(LogHandler):
    def __init__(self): super().__init__(LogLevel.ERROR)
    def write(self, level: LogLevel, msg: str):
        if level == LogLevel.ERROR:
            print(f"{datetime.datetime.now()} [ERROR] {msg}")

if __name__ == "__main__":
    chain = InfoHandler()
    chain.set_next(ErrorHandler())

    chain.log(LogLevel.INFO, "Worker node connected")
    chain.log(LogLevel.ERROR, "Redis connection timed out")`
};

// ─────────────────────────────────────────────────────────────
// 5. COFFEE MACHINE
// ─────────────────────────────────────────────────────────────
batch1["coffee-machine"] = {
  java: `import java.util.HashMap;
import java.util.Map;

interface Coffee {
    String getDescription();
    double getCost();
}

class Espresso implements Coffee {
    public String getDescription() { return "Espresso"; }
    public double getCost() { return 2.50; }
}

abstract class CoffeeDecorator implements Coffee {
    protected final Coffee decoratedCoffee;
    public CoffeeDecorator(Coffee coffee) { this.decoratedCoffee = coffee; }
    public String getDescription() { return decoratedCoffee.getDescription(); }
    public double getCost() { return decoratedCoffee.getCost(); }
}

class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) { super(coffee); }
    public String getDescription() { return super.getDescription() + " + Steamed Milk"; }
    public double getCost() { return super.getCost() + 0.60; }
}

class CaramelDecorator extends CoffeeDecorator {
    public CaramelDecorator(Coffee coffee) { super(coffee); }
    public String getDescription() { return super.getDescription() + " + Caramel Syrup"; }
    public double getCost() { return super.getCost() + 0.75; }
}

class CoffeeMachine {
    private final Map<String, Integer> inventory = new HashMap<>();

    public CoffeeMachine() {
        inventory.put("CoffeeBeans", 500); // grams
        inventory.put("Milk", 1000);        // ml
        inventory.put("Water", 2000);       // ml
    }

    public synchronized boolean brew(String recipe, int beans, int water, int milk) {
        if (inventory.get("CoffeeBeans") < beans || inventory.get("Water") < water || inventory.get("Milk") < milk) {
            System.out.println("❌ Cannot brew " + recipe + ": Insufficient ingredients!");
            return false;
        }
        inventory.put("CoffeeBeans", inventory.get("CoffeeBeans") - beans);
        inventory.put("Water", inventory.get("Water") - water);
        inventory.put("Milk", inventory.get("Milk") - milk);
        System.out.println("☕ Brewing fresh " + recipe + "... Done!");
        return true;
    }
}

public class Main {
    public static void main(String[] args) {
        CoffeeMachine machine = new CoffeeMachine();
        Coffee order = new Espresso();
        order = new MilkDecorator(order);
        order = new CaramelDecorator(order);

        System.out.println("Ordered: " + order.getDescription());
        System.out.printf("Total Cost: $%.2f\\n", order.getCost());
        machine.brew(order.getDescription(), 20, 50, 100);
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <memory>

class Coffee {
public:
    virtual ~Coffee() = default;
    virtual std::string desc() const = 0;
    virtual double cost() const = 0;
};

class Espresso : public Coffee {
public:
    std::string desc() const override { return "Espresso"; }
    double cost() const override { return 2.50; }
};

class CoffeeDecorator : public Coffee {
protected:
    std::shared_ptr<Coffee> coffee;
public:
    CoffeeDecorator(std::shared_ptr<Coffee> c) : coffee(c) {}
    std::string desc() const override { return coffee->desc(); }
    double cost() const override { return coffee->cost(); }
};

class Milk : public CoffeeDecorator {
public:
    Milk(std::shared_ptr<Coffee> c) : CoffeeDecorator(c) {}
    std::string desc() const override { return coffee->desc() + ", Milk"; }
    double cost() const override { return coffee->cost() + 0.50; }
};

int main() {
    std::shared_ptr<Coffee> myCoffee = std::make_shared<Espresso>();
    myCoffee = std::make_shared<Milk>(myCoffee);
    std::cout << myCoffee->desc() << " : $" << myCoffee->cost() << "\\n";
    return 0;
}`,
  python: `from abc import ABC, abstractmethod

class Coffee(ABC):
    @abstractmethod
    def get_description(self) -> str: pass
    @abstractmethod
    def get_cost(self) -> float: pass

class Espresso(Coffee):
    def get_description(self): return "Espresso"
    def get_cost(self): return 2.50

class CoffeeDecorator(Coffee):
    def __init__(self, coffee: Coffee):
        self._coffee = coffee
    def get_description(self): return self._coffee.get_description()
    def get_cost(self): return self._coffee.get_cost()

class Milk(CoffeeDecorator):
    def get_description(self): return self._coffee.get_description() + " + Steamed Milk"
    def get_cost(self): return self._coffee.get_cost() + 0.60

class Caramel(CoffeeDecorator):
    def get_description(self): return self._coffee.get_description() + " + Caramel Syrup"
    def get_cost(self): return self._coffee.get_cost() + 0.75

if __name__ == "__main__":
    cup = Caramel(Milk(Espresso()))
    print(f"Item: {cup.get_description()}")
    print(f"Total: \${cup.get_cost():.2f}")`
};

// ─────────────────────────────────────────────────────────────
// 6. VENDING MACHINE
// ─────────────────────────────────────────────────────────────
batch1["vending-machine"] = {
  java: `import java.util.*;

enum Coin { NICKEL(5), DIME(10), QUARTER(25), DOLLAR(100);
    final int value;
    Coin(int v) { this.value = v; }
}

class Item {
    private final String name;
    private final int priceCents;
    public Item(String n, int p) { this.name = n; this.priceCents = p; }
    public String getName() { return name; }
    public int getPriceCents() { return priceCents; }
}

interface VendingState {
    void insertCoin(VendingMachine vm, Coin coin);
    void selectItem(VendingMachine vm, String code);
    void dispense(VendingMachine vm);
    void refund(VendingMachine vm);
}

class IdleState implements VendingState {
    public void insertCoin(VendingMachine vm, Coin coin) {
        vm.addBalance(coin.value);
        vm.setState(vm.getHasMoneyState());
    }
    public void selectItem(VendingMachine vm, String code) { System.out.println("Insert coin first."); }
    public void dispense(VendingMachine vm) { System.out.println("No item selected."); }
    public void refund(VendingMachine vm) { System.out.println("No balance to refund."); }
}

class HasMoneyState implements VendingState {
    public void insertCoin(VendingMachine vm, Coin coin) { vm.addBalance(coin.value); }
    public void selectItem(VendingMachine vm, String code) {
        Item item = vm.getItem(code);
        if (item == null) {
            System.out.println("Invalid code.");
            return;
        }
        if (vm.getBalance() < item.getPriceCents()) {
            System.out.println("Insufficient balance. Needed: " + item.getPriceCents() + "¢, Have: " + vm.getBalance() + "¢");
            return;
        }
        vm.setSelectedCode(code);
        vm.setState(vm.getDispenseState());
        vm.dispense();
    }
    public void dispense(VendingMachine vm) { System.out.println("Select item first."); }
    public void refund(VendingMachine vm) {
        System.out.println("Refunded: " + vm.getBalance() + "¢");
        vm.resetBalance();
        vm.setState(vm.getIdleState());
    }
}

class DispenseState implements VendingState {
    public void insertCoin(VendingMachine vm, Coin coin) { System.out.println("Please wait, dispensing item."); }
    public void selectItem(VendingMachine vm, String code) { System.out.println("Dispensing in progress."); }
    public void dispense(VendingMachine vm) {
        Item item = vm.getItem(vm.getSelectedCode());
        vm.deductBalance(item.getPriceCents());
        System.out.println("✅ Dispensed: " + item.getName());
        int change = vm.getBalance();
        if (change > 0) System.out.println("💰 Returning change: " + change + "¢");
        vm.resetBalance();
        vm.setState(vm.getIdleState());
    }
    public void refund(VendingMachine vm) { System.out.println("Cannot refund while dispensing."); }
}

class VendingMachine {
    private final Map<String, Item> inventory = new HashMap<>();
    private final VendingState idle = new IdleState();
    private final VendingState hasMoney = new HasMoneyState();
    private final VendingState dispense = new DispenseState();
    private VendingState state = idle;
    private int balance = 0;
    private String selectedCode = null;

    public void addItem(String code, Item item) { inventory.put(code, item); }
    public Item getItem(String code) { return inventory.get(code); }
    public void setState(VendingState s) { this.state = s; }
    public VendingState getIdleState() { return idle; }
    public VendingState getHasMoneyState() { return hasMoney; }
    public VendingState getDispenseState() { return dispense; }

    public void insertCoin(Coin c) { state.insertCoin(this, c); }
    public void selectItem(String code) { state.selectItem(this, code); }
    public void dispense() { state.dispense(this); }
    public void refund() { state.refund(this); }

    public void addBalance(int cents) { this.balance += cents; System.out.println("Balance: " + balance + "¢"); }
    public void deductBalance(int cents) { this.balance -= cents; }
    public void resetBalance() { this.balance = 0; }
    public int getBalance() { return balance; }
    public void setSelectedCode(String code) { this.selectedCode = code; }
    public String getSelectedCode() { return selectedCode; }
}

public class Main {
    public static void main(String[] args) {
        VendingMachine vm = new VendingMachine();
        vm.addItem("A1", new Item("Soda Can", 75));
        vm.addItem("B2", new Item("Potato Chips", 125));

        vm.insertCoin(Coin.DOLLAR);
        vm.selectItem("A1");
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <unordered_map>

class VendingMachine {
    int balance = 0;
    std::unordered_map<std::string, std::pair<std::string, int>> inventory;
public:
    VendingMachine() {
        inventory["A1"] = {"Soda", 75};
        inventory["B1"] = {"Chips", 125};
    }
    void insertCoin(int cents) {
        balance += cents;
        std::cout << "Inserted " << cents << "c. Balance: " << balance << "c\\n";
    }
    void select(const std::string& code) {
        if (!inventory.count(code)) {
            std::cout << "Invalid code\\n";
            return;
        }
        auto [name, price] = inventory[code];
        if (balance >= price) {
            balance -= price;
            std::cout << "Dispensed " << name << "! Change: " << balance << "c\\n";
            balance = 0;
        } else {
            std::cout << "Insufficient balance for " << name << "\\n";
        }
    }
};

int main() {
    VendingMachine vm;
    vm.insertCoin(100);
    vm.select("A1");
    return 0;
}`,
  python: `class Item:
    def __init__(self, name: str, price_cents: int):
        self.name = name
        self.price = price_cents

class VendingMachine:
    def __init__(self):
        self.inventory = {
            "A1": Item("Soda", 75),
            "B2": Item("Chips", 125)
        }
        self.balance = 0

    def insert_coin(self, cents: int):
        self.balance += cents
        print(f"💰 Inserted {cents}¢. Total: {self.balance}¢")

    def select_item(self, code: str):
        if code not in self.inventory:
            print("Invalid item code.")
            return
        item = self.inventory[code]
        if self.balance < item.price:
            print(f"❌ Need {item.price}¢, current balance is only {self.balance}¢")
            return

        change = self.balance - item.price
        self.balance = 0
        print(f"🥤 Dispensed: {item.name}")
        if change > 0:
            print(f"🪙 Change returned: {change}¢")

if __name__ == "__main__":
    vm = VendingMachine()
    vm.insert_coin(100)
    vm.select_item("A1")`
};

// ─────────────────────────────────────────────────────────────
// 7. PARKING LOT SYSTEM
// ─────────────────────────────────────────────────────────────
batch1["parking-lot-system"] = {
  java: `import java.util.*;

enum VehicleType { MOTORCYCLE, CAR, TRUCK }

class Vehicle {
    private final String licensePlate;
    private final VehicleType type;
    public Vehicle(String lp, VehicleType t) { this.licensePlate = lp; this.type = t; }
    public String getLicensePlate() { return licensePlate; }
    public VehicleType getType() { return type; }
}

class ParkingSpot {
    private final int spotId;
    private final VehicleType spotType;
    private Vehicle parkedVehicle;

    public ParkingSpot(int id, VehicleType type) { this.spotId = id; this.spotType = type; }
    public boolean isAvailable() { return parkedVehicle == null; }
    public boolean canFit(Vehicle v) { return isAvailable() && v.getType() == spotType; }
    public void park(Vehicle v) { this.parkedVehicle = v; }
    public void unpark() { this.parkedVehicle = null; }
    public int getSpotId() { return spotId; }
    public Vehicle getParkedVehicle() { return parkedVehicle; }
}

class Ticket {
    private final String ticketId;
    private final String licensePlate;
    private final int spotId;
    private final long entryTimeMillis;

    public Ticket(String plate, int spotId) {
        this.ticketId = UUID.randomUUID().toString().substring(0, 8);
        this.licensePlate = plate;
        this.spotId = spotId;
        this.entryTimeMillis = System.currentTimeMillis();
    }
    public String getTicketId() { return ticketId; }
    public int getSpotId() { return spotId; }
    public long getEntryTimeMillis() { return entryTimeMillis; }
}

class ParkingLot {
    private final List<ParkingSpot> spots = new ArrayList<>();
    private final Map<String, Ticket> activeTickets = new HashMap<>();

    public ParkingLot(int motorcycleSpots, int carSpots, int truckSpots) {
        int id = 1;
        for (int i = 0; i < motorcycleSpots; i++) spots.add(new ParkingSpot(id++, VehicleType.MOTORCYCLE));
        for (int i = 0; i < carSpots; i++) spots.add(new ParkingSpot(id++, VehicleType.CAR));
        for (int i = 0; i < truckSpots; i++) spots.add(new ParkingSpot(id++, VehicleType.TRUCK));
    }

    public synchronized Ticket parkVehicle(Vehicle v) {
        for (ParkingSpot s : spots) {
            if (s.canFit(v)) {
                s.park(v);
                Ticket ticket = new Ticket(v.getLicensePlate(), s.getSpotId());
                activeTickets.put(ticket.getTicketId(), ticket);
                System.out.println("🚗 Parked " + v.getType() + " [" + v.getLicensePlate() + "] in Spot #" + s.getSpotId());
                return ticket;
            }
        }
        System.out.println("❌ Parking Full for " + v.getType());
        return null;
    }

    public synchronized double exitVehicle(String ticketId) {
        Ticket t = activeTickets.remove(ticketId);
        if (t == null) {
            System.out.println("Invalid Ticket ID");
            return 0.0;
        }
        ParkingSpot spot = spots.get(t.getSpotId() - 1);
        spot.unpark();
        long durationHours = Math.max(1, (System.currentTimeMillis() - t.getEntryTimeMillis()) / 3600000 + 1);
        double fee = durationHours * 10.0; // $10 per hour
        System.out.printf("🏁 Vehicle exited Spot #%d. Total Fee: $%.2f\\n", spot.getSpotId(), fee);
        return fee;
    }
}

public class Main {
    public static void main(String[] args) {
        ParkingLot lot = new ParkingLot(2, 2, 1);
        Vehicle car1 = new Vehicle("KA-01-AB-1234", VehicleType.CAR);
        Vehicle bike1 = new Vehicle("KA-02-XY-9999", VehicleType.MOTORCYCLE);

        Ticket t1 = lot.parkVehicle(car1);
        Ticket t2 = lot.parkVehicle(bike1);

        if (t1 != null) lot.exitVehicle(t1.getTicketId());
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <memory>

enum class Type { BIKE, CAR };

struct Vehicle {
    std::string plate;
    Type type;
};

class ParkingLot {
    std::vector<bool> carSpots;
    std::unordered_map<std::string, int> occupied;
public:
    ParkingLot(int cars) : carSpots(cars, false) {}

    int park(const Vehicle& v) {
        for (int i = 0; i < (int)carSpots.size(); i++) {
            if (!carSpots[i]) {
                carSpots[i] = true;
                occupied[v.plate] = i;
                std::cout << "Parked " << v.plate << " at Spot " << i << "\\n";
                return i;
            }
        }
        std::cout << "Lot Full\\n";
        return -1;
    }

    void exit(const std::string& plate) {
        if (occupied.count(plate)) {
            int spot = occupied[plate];
            carSpots[spot] = false;
            occupied.erase(plate);
            std::cout << "Vehicle " << plate << " departed Spot " << spot << "\\n";
        }
    }
};

int main() {
    ParkingLot lot(2);
    Vehicle c1{"KA01A1111", Type::CAR};
    lot.park(c1);
    lot.exit("KA01A1111");
    return 0;
}`,
  python: `from enum import Enum
import uuid
import time

class VehicleType(Enum):
    BIKE = "BIKE"
    CAR = "CAR"

class Vehicle:
    def __init__(self, plate: str, v_type: VehicleType):
        self.plate = plate
        self.v_type = v_type

class ParkingLot:
    def __init__(self, capacity: int = 5):
        self.capacity = capacity
        self.spots = {} # spot_id -> Vehicle
        self.tickets = {} # ticket_id -> (spot_id, entry_time)

    def park(self, vehicle: Vehicle) -> str:
        for spot_id in range(1, self.capacity + 1):
            if spot_id not in self.spots:
                self.spots[spot_id] = vehicle
                ticket_id = str(uuid.uuid4())[:6]
                self.tickets[ticket_id] = (spot_id, time.time())
                print(f"🚘 Parked {vehicle.plate} in Spot #{spot_id} [Ticket: {ticket_id}]")
                return ticket_id
        print("❌ Parking Lot Full!")
        return None

    def unpark(self, ticket_id: str) -> float:
        if ticket_id not in self.tickets:
            print("Invalid ticket.")
            return 0.0
        spot_id, entry_time = self.tickets.pop(ticket_id)
        vehicle = self.spots.pop(spot_id)
        fee = 10.0 # flat $10/hour
        print(f"👋 {vehicle.plate} left Spot #{spot_id}. Fee: \${fee:.2f}")
        return fee

if __name__ == "__main__":
    lot = ParkingLot(2)
    t1 = lot.park(Vehicle("ABC-1234", VehicleType.CAR))
    lot.unpark(t1)`
};

// ─────────────────────────────────────────────────────────────
// 8. SNAKE & LADDER
// ─────────────────────────────────────────────────────────────
batch1["snake-ladder"] = {
  java: `import java.util.*;

class Player {
    private final String name;
    private int position = 0;
    public Player(String name) { this.name = name; }
    public String getName() { return name; }
    public int getPosition() { return position; }
    public void setPosition(int p) { this.position = p; }
}

class Dice {
    private final int sides;
    private final Random rand = new Random();
    public Dice(int sides) { this.sides = sides; }
    public int roll() { return rand.nextInt(sides) + 1; }
}

class SnakeAndLadderGame {
    private final int boardSize;
    private final Map<Integer, Integer> jumpEntities = new HashMap<>(); // Snake (head->tail) or Ladder (bottom->top)
    private final Queue<Player> players = new LinkedList<>();
    private final Dice dice;
    private boolean winnerDeclared = false;

    public SnakeAndLadderGame(int boardSize, Dice dice) {
        this.boardSize = boardSize;
        this.dice = dice;
    }

    public void addLadder(int start, int end) { jumpEntities.put(start, end); }
    public void addSnake(int head, int tail) { jumpEntities.put(head, tail); }
    public void addPlayer(Player p) { players.add(p); }

    public void playTurn() {
        if (winnerDeclared || players.isEmpty()) return;
        Player p = players.poll();
        int roll = dice.roll();
        int nextPos = p.getPosition() + roll;

        if (nextPos > boardSize) {
            System.out.println(p.getName() + " rolled a " + roll + " but needs exact roll to reach " + boardSize + ". Stays at " + p.getPosition());
            players.add(p);
            return;
        }

        if (jumpEntities.containsKey(nextPos)) {
            int finalPos = jumpEntities.get(nextPos);
            if (finalPos > nextPos) System.out.println("🪜 " + p.getName() + " climbed a Ladder from " + nextPos + " to " + finalPos);
            else System.out.println("🐍 " + p.getName() + " was bitten by a Snake at " + nextPos + ", sliding to " + finalPos);
            nextPos = finalPos;
        } else {
            System.out.println("🎲 " + p.getName() + " rolled " + roll + " -> moved to " + nextPos);
        }

        p.setPosition(nextPos);

        if (p.getPosition() == boardSize) {
            System.out.println("🏆 " + p.getName() + " WINS THE GAME!");
            winnerDeclared = true;
            return;
        }

        players.add(p);
    }
}

public class Main {
    public static void main(String[] args) {
        SnakeAndLadderGame game = new SnakeAndLadderGame(100, new Dice(6));
        game.addLadder(4, 14);
        game.addLadder(28, 84);
        game.addSnake(97, 78);
        game.addSnake(62, 19);

        game.addPlayer(new Player("Alice"));
        game.addPlayer(new Player("Bob"));

        for (int i = 0; i < 10; i++) {
            game.playTurn();
        }
    }
}`,
  cpp: `#include <iostream>
#include <unordered_map>
#include <queue>
#include <string>

class SnakeAndLadder {
    std::unordered_map<int, int> jumps;
    std::queue<std::string> players;
    std::unordered_map<std::string, int> positions;
public:
    void addJump(int from, int to) { jumps[from] = to; }
    void addPlayer(const std::string& name) {
        players.push(name);
        positions[name] = 0;
    }
    void move(int roll) {
        if (players.empty()) return;
        std::string p = players.front();
        players.pop();
        int target = positions[p] + roll;
        if (target <= 100) {
            if (jumps.count(target)) target = jumps[target];
            positions[p] = target;
            std::cout << p << " rolled " << roll << " -> now at " << target << "\\n";
            if (target == 100) {
                std::cout << p << " wins!\\n";
                return;
            }
        }
        players.push(p);
    }
};

int main() {
    SnakeAndLadder g;
    g.addJump(4, 14);
    g.addJump(17, 7);
    g.addPlayer("P1");
    g.addPlayer("P2");
    g.move(4);
    g.move(6);
    return 0;
}`,
  python: `import random
from collections import deque

class SnakeLadderGame:
    def __init__(self, size: int = 100):
        self.size = size
        self.jumps = {} # start -> end
        self.players = deque()
        self.positions = {}

    def add_snake(self, head: int, tail: int): self.jumps[head] = tail
    def add_ladder(self, bottom: int, top: int): self.jumps[bottom] = top

    def add_player(self, name: str):
        self.players.append(name)
        self.positions[name] = 0

    def play_turn(self):
        curr = self.players.popleft()
        roll = random.randint(1, 6)
        next_pos = self.positions[curr] + roll

        if next_pos <= self.size:
            if next_pos in self.jumps:
                next_pos = self.jumps[next_pos]
            self.positions[curr] = next_pos
            print(f"🎲 {curr} rolled {roll} -> moved to {next_pos}")
            if next_pos == self.size:
                print(f"🏆 {curr} WINS!")
                return True
        self.players.append(curr)
        return False

if __name__ == "__main__":
    game = SnakeLadderGame(100)
    game.add_ladder(4, 25)
    game.add_snake(30, 10)
    game.add_player("Alice")
    game.add_player("Bob")
    for _ in range(6): game.play_turn()`
};

// ─────────────────────────────────────────────────────────────
// 9. LIBRARY MANAGEMENT SYSTEM
// ─────────────────────────────────────────────────────────────
batch1["library-management-system"] = {
  java: `import java.util.*;

enum BookStatus { AVAILABLE, BORROWED, RESERVED }

class Book {
    private final String isbn, title, author;
    private BookStatus status = BookStatus.AVAILABLE;

    public Book(String isbn, String title, String author) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
    }
    public String getIsbn() { return isbn; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public BookStatus getStatus() { return status; }
    public void setStatus(BookStatus s) { this.status = s; }
}

class Member {
    private final String memberId, name;
    private final List<Book> borrowedBooks = new ArrayList<>();

    public Member(String id, String name) { this.memberId = id; this.name = name; }
    public String getMemberId() { return memberId; }
    public String getName() { return name; }
    public List<Book> getBorrowedBooks() { return borrowedBooks; }
}

class Library {
    private final Map<String, Book> catalog = new HashMap<>();
    private final Map<String, Member> members = new HashMap<>();

    public void addBook(Book b) { catalog.put(b.getIsbn(), b); }
    public void registerMember(Member m) { members.put(m.getMemberId(), m); }

    public synchronized boolean borrowBook(String memberId, String isbn) {
        Member m = members.get(memberId);
        Book b = catalog.get(isbn);
        if (m == null || b == null) return false;

        if (b.getStatus() == BookStatus.AVAILABLE && m.getBorrowedBooks().size() < 5) {
            b.setStatus(BookStatus.BORROWED);
            m.getBorrowedBooks().add(b);
            System.out.println("📚 " + m.getName() + " checked out: " + b.getTitle());
            return true;
        }
        System.out.println("❌ Book unavailable or limit exceeded for " + m.getName());
        return false;
    }

    public synchronized void returnBook(String memberId, String isbn) {
        Member m = members.get(memberId);
        Book b = catalog.get(isbn);
        if (m != null && b != null && m.getBorrowedBooks().remove(b)) {
            b.setStatus(BookStatus.AVAILABLE);
            System.out.println("✅ " + m.getName() + " returned: " + b.getTitle());
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Library lib = new Library();
        lib.addBook(new Book("978-0132350884", "Clean Code", "Robert C. Martin"));
        lib.addBook(new Book("978-0201633610", "Design Patterns", "Gang of Four"));

        Member alice = new Member("M001", "Alice");
        lib.registerMember(alice);

        lib.borrowBook("M001", "978-0132350884");
        lib.returnBook("M001", "978-0132350884");
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>

struct Book {
    std::string isbn;
    std::string title;
    bool available = true;
};

class Library {
    std::unordered_map<std::string, Book> catalog;
public:
    void addBook(const std::string& isbn, const std::string& title) {
        catalog[isbn] = {isbn, title, true};
    }
    bool borrow(const std::string& isbn) {
        if (catalog.count(isbn) && catalog[isbn].available) {
            catalog[isbn].available = false;
            std::cout << "Borrowed: " << catalog[isbn].title << "\\n";
            return true;
        }
        std::cout << "Not available\\n";
        return false;
    }
    void returnBook(const std::string& isbn) {
        if (catalog.count(isbn)) {
            catalog[isbn].available = true;
            std::cout << "Returned: " << catalog[isbn].title << "\\n";
        }
    }
};

int main() {
    Library lib;
    lib.addBook("101", "Clean Code");
    lib.borrow("101");
    lib.returnBook("101");
    return 0;
}`,
  python: `class Book:
    def __init__(self, isbn: str, title: str, author: str):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.available = True

class Library:
    def __init__(self):
        self.catalog = {}

    def add_book(self, book: Book):
        self.catalog[book.isbn] = book

    def borrow_book(self, isbn: str, member_name: str) -> bool:
        book = self.catalog.get(isbn)
        if book and book.available:
            book.available = False
            print(f"📖 {member_name} borrowed '{book.title}'")
            return True
        print(f"❌ '{book.title if book else isbn}' is currently unavailable.")
        return False

    def return_book(self, isbn: str):
        book = self.catalog.get(isbn)
        if book:
            book.available = True
            print(f"✅ Returned '{book.title}' to catalog.")

if __name__ == "__main__":
    lib = Library()
    lib.add_book(Book("101", "Designing Data-Intensive Applications", "Martin Kleppmann"))
    lib.borrow_book("101", "Alice")
    lib.return_book("101")`
};

let count = 0;
lldData.forEach((q) => {
  if (batch1[q.slug]) {
    q.languages = batch1[q.slug];
    count++;
  }
});

fs.writeFileSync(lldPath, JSON.stringify(lldData, null, 2), "utf-8");
console.log(`Successfully updated batch 1: ${count} questions.`);
