const fs = require("fs");
const path = require("path");

const lldPath = path.resolve(__dirname, "../../beingsde-ui/src/data/lld.json");
const lldData = JSON.parse(fs.readFileSync(lldPath, "utf-8"));

const batch2 = {};

// ─────────────────────────────────────────────────────────────
// 10. CRICBUZZ
// ─────────────────────────────────────────────────────────────
batch2["cricbuzz"] = {
  java: `import java.util.*;

enum BallOutcome { DOT, RUN_1, RUN_4, RUN_6, WICKET }

interface MatchObserver {
    void update(String event);
}

class ScorecardDisplay implements MatchObserver {
    public void update(String event) {
        System.out.println("📺 [LIVE DISPLAY] " + event);
    }
}

class MobileAppNotification implements MatchObserver {
    public void update(String event) {
        if (event.contains("WICKET") || event.contains("SIX")) {
            System.out.println("🔔 [PUSH NOTIFICATION] " + event);
        }
    }
}

class Match {
    private final String teamA, teamB;
    private int score = 0, wickets = 0, ballsBowled = 0;
    private final List<MatchObserver> observers = new ArrayList<>();

    public Match(String a, String b) { this.teamA = a; this.teamB = b; }

    public void addObserver(MatchObserver o) { observers.add(o); }

    public void recordBall(BallOutcome outcome) {
        ballsBowled++;
        String eventDetail = "";
        switch (outcome) {
            case RUN_1: score += 1; eventDetail = "1 run taken"; break;
            case RUN_4: score += 4; eventDetail = "FOUR runs boundary!"; break;
            case RUN_6: score += 6; eventDetail = "SIX! Out of the stadium!"; break;
            case WICKET: wickets++; eventDetail = "WICKET falls!"; break;
            case DOT: eventDetail = "Dot ball"; break;
        }

        int overs = ballsBowled / 6;
        int remainingBalls = ballsBowled % 6;
        String status = String.format("%s vs %s: %d/%d (Over %d.%d) - %s",
                teamA, teamB, score, wickets, overs, remainingBalls, eventDetail);

        notifyObservers(status);
    }

    private void notifyObservers(String status) {
        for (MatchObserver o : observers) o.update(status);
    }
}

public class Main {
    public static void main(String[] args) {
        Match match = new Match("India", "Australia");
        match.addObserver(new ScorecardDisplay());
        match.addObserver(new MobileAppNotification());

        match.recordBall(BallOutcome.RUN_4);
        match.recordBall(BallOutcome.DOT);
        match.recordBall(BallOutcome.RUN_6);
        match.recordBall(BallOutcome.WICKET);
    }
}`,
  cpp: `#include <iostream>
#include <vector>
#include <string>
#include <memory>

class MatchObserver {
public:
    virtual ~MatchObserver() = default;
    virtual void onUpdate(const std::string& msg) = 0;
};

class LiveDisplay : public MatchObserver {
public:
    void onUpdate(const std::string& msg) override {
        std::cout << "[DISPLAY] " << msg << "\\n";
    }
};

class CricketMatch {
    std::string t1, t2;
    int runs = 0, wkts = 0;
    std::vector<std::shared_ptr<MatchObserver>> observers;
public:
    CricketMatch(std::string a, std::string b) : t1(a), t2(b) {}
    void addObserver(std::shared_ptr<MatchObserver> o) { observers.push_back(o); }
    void addScore(int r, bool wicket = false) {
        runs += r;
        if (wicket) wkts++;
        std::string s = t1 + " vs " + t2 + ": " + std::to_string(runs) + "/" + std::to_string(wkts);
        for (auto& o : observers) o->onUpdate(s);
    }
};

int main() {
    CricketMatch match("IND", "ENG");
    match.addObserver(std::make_shared<LiveDisplay>());
    match.addScore(4);
    match.addScore(6);
    match.addScore(0, true);
    return 0;
}`,
  python: `class MatchObserver:
    def update(self, message: str): pass

class LiveScoreboard(MatchObserver):
    def update(self, message: str):
        print(f"📺 [SCOREBOARD] {message}")

class CricketMatch:
    def __init__(self, team_a: str, team_b: str):
        self.team_a = team_a
        self.team_b = team_b
        self.runs = 0
        self.wickets = 0
        self.balls = 0
        self.observers = []

    def subscribe(self, observer: MatchObserver):
        self.observers.append(observer)

    def ball_bowled(self, runs: int, is_wicket: bool = False):
        self.balls += 1
        self.runs += runs
        if is_wicket: self.wickets += 1
        overs = f"{self.balls // 6}.{self.balls % 6}"
        status = f"{self.team_a} vs {self.team_b}: {self.runs}/{self.wickets} (Over {overs})"
        for obs in self.observers:
            obs.update(status)

if __name__ == "__main__":
    match = CricketMatch("India", "Australia")
    match.subscribe(LiveScoreboard())
    match.ball_bowled(4)
    match.ball_bowled(6)
    match.ball_bowled(0, is_wicket=True)`
};

// ─────────────────────────────────────────────────────────────
// 11. RESTAURANT
// ─────────────────────────────────────────────────────────────
batch2["restaurant"] = {
  java: `import java.util.*;

enum OrderStatus { CREATED, PREPARING, SERVED, PAID }

class MenuItem {
    private final String id, name;
    private final double price;
    public MenuItem(String id, String name, double price) { this.id = id; this.name = name; this.price = price; }
    public String getName() { return name; }
    public double getPrice() { return price; }
}

class Table {
    private final int tableId;
    private final int seats;
    private boolean isOccupied = false;
    public Table(int id, int seats) { this.tableId = id; this.seats = seats; }
    public int getTableId() { return tableId; }
    public boolean isOccupied() { return isOccupied; }
    public void setOccupied(boolean occ) { this.isOccupied = occ; }
}

class Order {
    private final String orderId;
    private final Table table;
    private final List<MenuItem> items = new ArrayList<>();
    private OrderStatus status = OrderStatus.CREATED;

    public Order(String id, Table t) { this.orderId = id; this.table = t; }
    public void addItem(MenuItem item) { items.add(item); }
    public void setStatus(OrderStatus s) { this.status = s; }

    public double calculateTotal(double taxRate) {
        double subtotal = 0;
        for (MenuItem i : items) subtotal += i.getPrice();
        return subtotal + (subtotal * taxRate);
    }

    public void printReceipt() {
        System.out.println("🧾 Table #" + table.getTableId() + " Order Receipt:");
        for (MenuItem item : items) {
            System.out.printf("  - %-20s $%.2f\\n", item.getName(), item.getPrice());
        }
        System.out.printf("Total (inc. 5%% tax): $%.2f\\n", calculateTotal(0.05));
    }
}

public class Main {
    public static void main(String[] args) {
        Table t1 = new Table(5, 4);
        t1.setOccupied(true);

        Order order = new Order("ORD-101", t1);
        order.addItem(new MenuItem("M1", "Margherita Pizza", 14.50));
        order.addItem(new MenuItem("M2", "Pasta Carbonara", 16.00));
        order.addItem(new MenuItem("M3", "Tiramisu", 8.00));

        order.setStatus(OrderStatus.PREPARING);
        order.setStatus(OrderStatus.SERVED);
        order.printReceipt();
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <vector>
#include <numeric>

struct Item {
    std::string name;
    double price;
};

class Order {
    int tableId;
    std::vector<Item> items;
public:
    Order(int tid) : tableId(tid) {}
    void add(Item i) { items.push_back(i); }
    double total() const {
        double sum = 0;
        for (const auto& i : items) sum += i.price;
        return sum * 1.05; // 5% tax
    }
    void print() const {
        std::cout << "Table #" << tableId << " Total: $" << total() << "\\n";
    }
};

int main() {
    Order ord(4);
    ord.add({"Pizza", 14.0});
    ord.add({"Drink", 4.0});
    ord.print();
    return 0;
}`,
  python: `class MenuItem:
    def __init__(self, name: str, price: float):
        self.name = name
        self.price = price

class Order:
    def __init__(self, table_number: int):
        self.table_number = table_number
        self.items = []
        self.status = "CREATED"

    def add_item(self, item: MenuItem):
        self.items.append(item)

    def total(self, tax: float = 0.05) -> float:
        subtotal = sum(i.price for i in self.items)
        return subtotal * (1 + tax)

if __name__ == "__main__":
    order = Order(3)
    order.add_item(MenuItem("Burger", 12.0))
    order.add_item(MenuItem("Fries", 4.5))
    print(f"Table #{order.table_number} Bill: \${order.total():.2f}")`
};

// ─────────────────────────────────────────────────────────────
// 12. CACHE (LRU / LFU)
// ─────────────────────────────────────────────────────────────
batch2["cache"] = {
  java: `import java.util.HashMap;
import java.util.Map;

class LRUCache<K, V> {
    private static class Node<K, V> {
        K key;
        V value;
        Node<K, V> prev, next;
        Node(K k, V v) { this.key = k; this.value = v; }
    }

    private final int capacity;
    private final Map<K, Node<K, V>> map = new HashMap<>();
    private final Node<K, V> head = new Node<>(null, null);
    private final Node<K, V> tail = new Node<>(null, null);

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public synchronized V get(K key) {
        Node<K, V> node = map.get(key);
        if (node == null) return null;
        moveToHead(node);
        return node.value;
    }

    public synchronized void put(K key, V value) {
        Node<K, V> node = map.get(key);
        if (node != null) {
            node.value = value;
            moveToHead(node);
            return;
        }

        if (map.size() >= capacity) {
            Node<K, V> lru = removeTail();
            map.remove(lru.key);
            System.out.println("🗑️ Evicted LRU key: " + lru.key);
        }

        Node<K, V> newNode = new Node<>(key, value);
        map.put(key, newNode);
        addToHead(newNode);
    }

    private void addToHead(Node<K, V> node) {
        node.next = head.next;
        node.next.prev = node;
        node.prev = head;
        head.next = node;
    }

    private void removeNode(Node<K, V> node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void moveToHead(Node<K, V> node) {
        removeNode(node);
        addToHead(node);
    }

    private Node<K, V> removeTail() {
        Node<K, V> res = tail.prev;
        removeNode(res);
        return res;
    }
}

public class Main {
    public static void main(String[] args) {
        LRUCache<String, Integer> cache = new LRUCache<>(3);
        cache.put("user_1", 100);
        cache.put("user_2", 200);
        cache.put("user_3", 300);

        System.out.println("Get user_1: " + cache.get("user_1")); // Access user_1, makes user_2 LRU
        cache.put("user_4", 400); // Should evict user_2

        System.out.println("Get user_2 (should be null): " + cache.get("user_2"));
        System.out.println("Get user_4: " + cache.get("user_4"));
    }
}`,
  cpp: `#include <iostream>
#include <unordered_map>
#include <list>

template<typename K, typename V>
class LRUCache {
    int capacity;
    std::list<std::pair<K, V>> items;
    std::unordered_map<K, typename std::list<std::pair<K, V>>::iterator> map;
public:
    LRUCache(int cap) : capacity(cap) {}

    bool get(K key, V& outVal) {
        if (!map.count(key)) return false;
        items.splice(items.begin(), items, map[key]);
        outVal = map[key]->second;
        return true;
    }

    void put(K key, V val) {
        if (map.count(key)) {
            items.splice(items.begin(), items, map[key]);
            map[key]->second = val;
            return;
        }
        if (items.size() == capacity) {
            K lruKey = items.back().first;
            items.pop_back();
            map.erase(lruKey);
        }
        items.push_front({key, val});
        map[key] = items.begin();
    }
};

int main() {
    LRUCache<std::string, int> cache(2);
    cache.put("A", 1);
    cache.put("B", 2);
    int val;
    cache.get("A", val);
    cache.put("C", 3); // evicts B
    std::cout << "Has B: " << cache.get("B", val) << " (0 is false)\\n";
    return 0;
}`,
  python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return None
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            evicted, _ = self.cache.popitem(last=False)
            print(f"🗑️ Evicted LRU key: {evicted}")

if __name__ == "__main__":
    cache = LRUCache(2)
    cache.put("k1", 10)
    cache.put("k2", 20)
    print("get k1:", cache.get("k1"))
    cache.put("k3", 30) # evicts k2
    print("get k2:", cache.get("k2"))`
};

// ─────────────────────────────────────────────────────────────
// 13. FILE SYSTEM
// ─────────────────────────────────────────────────────────────
batch2["file-system"] = {
  java: `import java.util.*;

abstract class FileSystemEntity {
    protected String name;
    public FileSystemEntity(String name) { this.name = name; }
    public String getName() { return name; }
    public abstract boolean isDirectory();
}

class File extends FileSystemEntity {
    private final StringBuilder content = new StringBuilder();
    public File(String name) { super(name); }
    public boolean isDirectory() { return false; }
    public void append(String text) { content.append(text); }
    public String read() { return content.toString(); }
}

class Directory extends FileSystemEntity {
    private final Map<String, FileSystemEntity> children = new TreeMap<>();
    public Directory(String name) { super(name); }
    public boolean isDirectory() { return true; }
    public Map<String, FileSystemEntity> getChildren() { return children; }
    public void add(FileSystemEntity entity) { children.put(entity.getName(), entity); }
}

class InMemoryFileSystem {
    private final Directory root = new Directory("");

    public void mkdir(String path) {
        String[] parts = path.split("/");
        Directory curr = root;
        for (String p : parts) {
            if (p.isEmpty()) continue;
            curr.getChildren().putIfAbsent(p, new Directory(p));
            curr = (Directory) curr.getChildren().get(p);
        }
    }

    public void writeToFile(String filePath, String content) {
        int lastSlash = filePath.lastIndexOf('/');
        String dirPath = filePath.substring(0, Math.max(0, lastSlash));
        String fileName = filePath.substring(lastSlash + 1);

        if (!dirPath.isEmpty()) mkdir(dirPath);

        Directory dir = resolveDirectory(dirPath);
        dir.getChildren().putIfAbsent(fileName, new File(fileName));
        File f = (File) dir.getChildren().get(fileName);
        f.append(content);
    }

    public String readFile(String filePath) {
        int lastSlash = filePath.lastIndexOf('/');
        String dirPath = filePath.substring(0, Math.max(0, lastSlash));
        String fileName = filePath.substring(lastSlash + 1);

        Directory dir = resolveDirectory(dirPath);
        File f = (File) dir.getChildren().get(fileName);
        return f == null ? "" : f.read();
    }

    private Directory resolveDirectory(String path) {
        Directory curr = root;
        for (String p : path.split("/")) {
            if (p.isEmpty()) continue;
            curr = (Directory) curr.getChildren().get(p);
        }
        return curr;
    }
}

public class Main {
    public static void main(String[] args) {
        InMemoryFileSystem fs = new InMemoryFileSystem();
        fs.mkdir("/etc/nginx");
        fs.writeToFile("/etc/nginx/nginx.conf", "server { listen 80; }");

        System.out.println("Content of nginx.conf:\\n" + fs.readFile("/etc/nginx/nginx.conf"));
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <map>
#include <memory>

struct Node {
    bool isDir;
    std::string content;
    std::map<std::string, std::shared_ptr<Node>> children;
    Node(bool dir) : isDir(dir) {}
};

class FileSystem {
    std::shared_ptr<Node> root = std::make_shared<Node>(true);
public:
    void mkdir(const std::string& name) {
        root->children[name] = std::make_shared<Node>(true);
    }
    void writeFile(const std::string& name, const std::string& text) {
        auto f = std::make_shared<Node>(false);
        f->content = text;
        root->children[name] = f;
    }
    std::string readFile(const std::string& name) {
        return root->children.count(name) ? root->children[name]->content : "";
    }
};

int main() {
    FileSystem fs;
    fs.mkdir("docs");
    fs.writeFile("hello.txt", "Hello World");
    std::cout << fs.readFile("hello.txt") << "\\n";
    return 0;
}`,
  python: `class FileSystemNode:
    def __init__(self, is_dir: bool = True):
        self.is_dir = is_dir
        self.content = ""
        self.children = {}

class InMemoryFS:
    def __init__(self):
        self.root = FileSystemNode(True)

    def mkdir(self, path: str):
        curr = self.root
        for part in filter(None, path.split("/")):
            if part not in curr.children:
                curr.children[part] = FileSystemNode(True)
            curr = curr.children[part]

    def write_file(self, path: str, content: str):
        parts = list(filter(None, path.split("/")))
        file_name = parts[-1]
        self.mkdir("/".join(parts[:-1]))
        curr = self.root
        for part in parts[:-1]:
            curr = curr.children[part]
        if file_name not in curr.children:
            curr.children[file_name] = FileSystemNode(False)
        curr.children[file_name].content += content

    def read_file(self, path: str) -> str:
        curr = self.root
        for part in filter(None, path.split("/")):
            curr = curr.children[part]
        return curr.content

if __name__ == "__main__":
    fs = InMemoryFS()
    fs.write_file("/home/user/notes.txt", "LLD Masterclass")
    print("Content:", fs.read_file("/home/user/notes.txt"))`
};

// ─────────────────────────────────────────────────────────────
// 14. AMAZON LOCKER
// ─────────────────────────────────────────────────────────────
batch2["amazon-locker"] = {
  java: `import java.util.*;

enum LockerSize { SMALL, MEDIUM, LARGE }

class Package {
    private final String packageId;
    private final LockerSize size;
    public Package(String id, LockerSize s) { this.packageId = id; this.size = s; }
    public LockerSize getSize() { return size; }
}

class Compartment {
    private final int id;
    private final LockerSize size;
    private Package currentPackage;
    private String accessCode;

    public Compartment(int id, LockerSize size) { this.id = id; this.size = size; }
    public boolean isAvailable() { return currentPackage == null; }
    public boolean canFit(LockerSize s) { return isAvailable() && this.size.ordinal() >= s.ordinal(); }
    public void deposit(Package pkg, String code) { this.currentPackage = pkg; this.accessCode = code; }
    public Package retrieve(String code) {
        if (code != null && code.equals(accessCode)) {
            Package p = currentPackage;
            this.currentPackage = null;
            this.accessCode = null;
            return p;
        }
        return null;
    }
    public int getId() { return id; }
}

class LockerHub {
    private final List<Compartment> compartments = new ArrayList<>();
    private final Map<String, Integer> packageToLockerMap = new HashMap<>();

    public LockerHub(int small, int med, int large) {
        int id = 1;
        for (int i = 0; i < small; i++) compartments.add(new Compartment(id++, LockerSize.SMALL));
        for (int i = 0; i < med; i++) compartments.add(new Compartment(id++, LockerSize.MEDIUM));
        for (int i = 0; i < large; i++) compartments.add(new Compartment(id++, LockerSize.LARGE));
    }

    public synchronized String deliverPackage(Package pkg) {
        for (Compartment c : compartments) {
            if (c.canFit(pkg.getSize())) {
                String code = String.format("%06d", new Random().nextInt(999999));
                c.deposit(pkg, code);
                packageToLockerMap.put(code, c.getId());
                System.out.println("📦 Package deposited into Compartment #" + c.getId() + ". OTP: " + code);
                return code;
            }
        }
        System.out.println("❌ No locker compartment fits package size " + pkg.getSize());
        return null;
    }

    public synchronized boolean pickup(String code) {
        Integer compId = packageToLockerMap.get(code);
        if (compId == null) {
            System.out.println("❌ Invalid Pickup Code");
            return false;
        }
        Compartment c = compartments.get(compId - 1);
        Package p = c.retrieve(code);
        if (p != null) {
            packageToLockerMap.remove(code);
            System.out.println("✅ Customer picked up package from Locker #" + compId);
            return true;
        }
        return false;
    }
}

public class Main {
    public static void main(String[] args) {
        LockerHub hub = new LockerHub(2, 2, 1);
        Package pkg = new Package("PKG_999", LockerSize.MEDIUM);
        String code = hub.deliverPackage(pkg);
        if (code != null) {
            hub.pickup(code);
        }
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>

class LockerHub {
    std::unordered_map<std::string, int> otpToLocker;
    std::vector<bool> lockers;
public:
    LockerHub(int n) : lockers(n, false) {}
    std::string deposit(int lockerId) {
        if (!lockers[lockerId]) {
            lockers[lockerId] = true;
            std::string otp = "4455";
            otpToLocker[otp] = lockerId;
            return otp;
        }
        return "";
    }
    bool pickup(const std::string& otp) {
        if (otpToLocker.count(otp)) {
            int lId = otpToLocker[otp];
            lockers[lId] = false;
            otpToLocker.erase(otp);
            std::cout << "Unlocked Locker #" << lId << "\\n";
            return true;
        }
        return false;
    }
};

int main() {
    LockerHub hub(5);
    std::string otp = hub.deposit(2);
    hub.pickup(otp);
    return 0;
}`,
  python: `class LockerHub:
    def __init__(self, count: int = 5):
        self.lockers = {i: None for i in range(1, count + 1)}
        self.otps = {} # otp -> locker_id

    def deposit(self, pkg_name: str, otp: str = "123456") -> int:
        for lid, item in self.lockers.items():
            if item is None:
                self.lockers[lid] = pkg_name
                self.otps[otp] = lid
                print(f"📦 Deposited '{pkg_name}' into Locker #{lid}. OTP: {otp}")
                return lid
        print("❌ All lockers full!")
        return None

    def pickup(self, otp: str):
        if otp in self.otps:
            lid = self.otps.pop(otp)
            pkg = self.lockers[lid]
            self.lockers[lid] = None
            print(f"✅ Retrieved '{pkg}' from Locker #{lid}!")
            return pkg
        print("❌ Invalid OTP")
        return None

if __name__ == "__main__":
    hub = LockerHub(3)
    hub.deposit("Keyboard", "8899")
    hub.pickup("8899")`
};

// ─────────────────────────────────────────────────────────────
// 15. ONLINE AUCTION SYSTEM
// ─────────────────────────────────────────────────────────────
batch2["online-auction-system"] = {
  java: `import java.util.*;

interface BidderObserver {
    void onNewHighestBid(String item, double amount, String bidder);
}

class UserBidder implements BidderObserver {
    private final String name;
    public UserBidder(String name) { this.name = name; }
    public String getName() { return name; }
    public void onNewHighestBid(String item, double amount, String leadingBidder) {
        if (!name.equals(leadingBidder)) {
            System.out.printf("🔔 [ALERT to %s]: You were outbid on '%s'! New high: $%.2f by %s\\n",
                    name, item, amount, leadingBidder);
        }
    }
}

class AuctionItem {
    private final String name;
    private double currentHighestBid;
    private UserBidder highestBidder;
    private boolean isClosed = false;
    private final List<BidderObserver> observers = new ArrayList<>();

    public AuctionItem(String name, double startingPrice) {
        this.name = name;
        this.currentHighestBid = startingPrice;
    }

    public void registerBidder(BidderObserver b) { observers.add(b); }

    public synchronized boolean placeBid(UserBidder bidder, double bidAmount) {
        if (isClosed) {
            System.out.println("❌ Auction is closed!");
            return false;
        }
        if (bidAmount <= currentHighestBid) {
            System.out.printf("❌ Bid $%.2f rejected. Must be > current highest $%.2f\\n", bidAmount, currentHighestBid);
            return false;
        }

        this.currentHighestBid = bidAmount;
        this.highestBidder = bidder;
        System.out.printf("🔨 New High Bid for '%s': $%.2f by %s\\n", name, bidAmount, bidder.getName());

        for (BidderObserver o : observers) {
            o.onNewHighestBid(name, bidAmount, bidder.getName());
        }
        return true;
    }

    public void closeAuction() {
        this.isClosed = true;
        System.out.printf("🏁 AUCTION CLOSED for '%s'! Winner: %s at $%.2f\\n",
                name, (highestBidder != null ? highestBidder.getName() : "None"), currentHighestBid);
    }
}

public class Main {
    public static void main(String[] args) {
        AuctionItem painting = new AuctionItem("Vintage Oil Painting", 100.0);
        UserBidder alice = new UserBidder("Alice");
        UserBidder bob = new UserBidder("Bob");

        painting.registerBidder(alice);
        painting.registerBidder(bob);

        painting.placeBid(alice, 120.0);
        painting.placeBid(bob, 150.0);
        painting.closeAuction();
    }
}`,
  cpp: `#include <iostream>
#include <string>

class Auction {
    std::string item;
    double highBid;
    std::string leader;
public:
    Auction(std::string name, double start) : item(name), highBid(start) {}
    bool bid(const std::string& user, double amount) {
        if (amount > highBid) {
            highBid = amount;
            leader = user;
            std::cout << user << " leads with $" << amount << "\\n";
            return true;
        }
        return false;
    }
};

int main() {
    Auction a("Watch", 200.0);
    a.bid("Alice", 250.0);
    a.bid("Bob", 300.0);
    return 0;
}`,
  python: `class Auction:
    def __init__(self, item_name: str, starting_price: float):
        self.item = item_name
        self.high_bid = starting_price
        self.leader = None

    def bid(self, user: str, amount: float) -> bool:
        if amount > self.high_bid:
            self.high_bid = amount
            self.leader = user
            print(f"🔨 {user} is leading '{self.item}' at \${amount:.2f}")
            return True
        print(f"❌ Bid \${amount:.2f} too low. Current high is \${self.high_bid:.2f}")
        return False

if __name__ == "__main__":
    auc = Auction("First Edition Book", 50.0)
    auc.bid("Alice", 70.0)
    auc.bid("Bob", 85.0)`
};

// ─────────────────────────────────────────────────────────────
// 16. BOOKMYSHOW
// ─────────────────────────────────────────────────────────────
batch2["bookmyshow"] = {
  java: `import java.util.*;
import java.util.concurrent.locks.ReentrantLock;

enum SeatStatus { AVAILABLE, LOCKED, BOOKED }

class Seat {
    private final String seatId;
    private SeatStatus status = SeatStatus.AVAILABLE;
    private final ReentrantLock lock = new ReentrantLock();

    public Seat(String id) { this.seatId = id; }
    public String getSeatId() { return seatId; }
    public SeatStatus getStatus() { return status; }

    public boolean lockSeat() {
        if (lock.tryLock()) {
            if (status == SeatStatus.AVAILABLE) {
                status = SeatStatus.LOCKED;
                return true;
            }
            lock.unlock();
        }
        return false;
    }

    public void confirmBooking() {
        if (status == SeatStatus.LOCKED) {
            status = SeatStatus.BOOKED;
            lock.unlock();
        }
    }

    public void releaseLock() {
        if (status == SeatStatus.LOCKED) {
            status = SeatStatus.AVAILABLE;
            lock.unlock();
        }
    }
}

class Show {
    private final String movieName;
    private final Map<String, Seat> seats = new HashMap<>();

    public Show(String movie, int totalSeats) {
        this.movieName = movie;
        for (int i = 1; i <= totalSeats; i++) {
            String sid = "S" + i;
            seats.put(sid, new Seat(sid));
        }
    }

    public synchronized boolean bookSeats(String customerName, List<String> seatIds) {
        List<Seat> lockedSeats = new ArrayList<>();
        for (String id : seatIds) {
            Seat s = seats.get(id);
            if (s != null && s.lockSeat()) {
                lockedSeats.add(s);
            } else {
                for (Seat l : lockedSeats) l.releaseLock();
                System.out.println("❌ Booking conflict! Seat " + id + " unavailable for " + customerName);
                return false;
            }
        }

        // Simulate payment completion
        for (Seat s : lockedSeats) s.confirmBooking();
        System.out.println("🎟️ Confirmed Booking for " + customerName + " on seats: " + seatIds);
        return true;
    }
}

public class Main {
    public static void main(String[] args) {
        Show show = new Show("Oppenheimer (IMAX)", 10);
        show.bookSeats("Alice", Arrays.asList("S1", "S2"));
        show.bookSeats("Bob", Arrays.asList("S2", "S3")); // S2 conflict!
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>

class Theater {
    std::unordered_map<std::string, bool> booked;
public:
    bool book(const std::string& seat, const std::string& user) {
        if (!booked[seat]) {
            booked[seat] = true;
            std::cout << "Seat " << seat << " booked by " << user << "\\n";
            return true;
        }
        std::cout << "Seat " << seat << " already taken!\\n";
        return false;
    }
};

int main() {
    Theater th;
    th.book("A1", "Alice");
    th.book("A1", "Bob");
    return 0;
}`,
  python: `class MovieBookingSystem:
    def __init__(self, movie: str, seats: int = 10):
        self.movie = movie
        self.booked_seats = set()

    def book(self, customer: str, seat_ids: list) -> bool:
        if any(s in self.booked_seats for s in seat_ids):
            print(f"❌ Booking failed for {customer}: One or more seats already reserved.")
            return False
        self.booked_seats.update(seat_ids)
        print(f"🎟️ {customer} successfully booked seats: {seat_ids} for '{self.movie}'")
        return True

if __name__ == "__main__":
    system = MovieBookingSystem("Interstellar", 10)
    system.book("Alice", ["A1", "A2"])
    system.book("Bob", ["A2", "A3"])`
};

// ─────────────────────────────────────────────────────────────
// 17. SPLITWISE
// ─────────────────────────────────────────────────────────────
batch2["splitwise"] = {
  java: `import java.util.*;

class User {
    private final String userId, name;
    public User(String id, String n) { this.userId = id; this.name = n; }
    public String getUserId() { return userId; }
    public String getName() { return name; }
}

class SplitwiseService {
    // balances[A][B] = how much A owes B
    private final Map<String, Map<String, Double>> balances = new HashMap<>();

    public void addExpenseEqual(String paidBy, double totalAmount, List<String> participants) {
        int n = participants.size();
        double splitAmount = totalAmount / n;

        for (String p : participants) {
            if (p.equals(paidBy)) continue;
            // p owes paidBy splitAmount
            balances.putIfAbsent(p, new HashMap<>());
            double currentOwed = balances.get(p).getOrDefault(paidBy, 0.0);
            balances.get(p).put(paidBy, currentOwed + splitAmount);
        }
        System.out.printf("💸 Expense of $%.2f paid by %s split equally among %d users.\\n", totalAmount, paidBy, n);
    }

    public void showBalances() {
        System.out.println("📊 --- Current Debt Ledger ---");
        boolean any = false;
        for (var entry : balances.entrySet()) {
            String borrower = entry.getKey();
            for (var debt : entry.getValue().entrySet()) {
                String lender = debt.getKey();
                double amount = debt.getValue();
                if (amount > 0.01) {
                    any = true;
                    System.out.printf("  %s owes %s: $%.2f\\n", borrower, lender, amount);
                }
            }
        }
        if (!any) System.out.println("All accounts settled!");
    }
}

public class Main {
    public static void main(String[] args) {
        SplitwiseService splitwise = new SplitwiseService();
        splitwise.addExpenseEqual("Alice", 300.0, Arrays.asList("Alice", "Bob", "Charlie"));
        splitwise.showBalances();
    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>

class Splitwise {
    std::unordered_map<std::string, double> balance;
public:
    void addEqualExpense(const std::string& payer, double amount, const std::vector<std::string>& users) {
        double split = amount / users.size();
        for (const auto& u : users) {
            balance[u] -= split;
        }
        balance[payer] += amount;
    }
    void printBalances() {
        for (auto [u, b] : balance) {
            std::cout << u << " net balance: $" << b << "\\n";
        }
    }
};

int main() {
    Splitwise sw;
    sw.addEqualExpense("Alice", 90.0, {"Alice", "Bob", "Charlie"});
    sw.printBalances();
    return 0;
}`,
  python: `from collections import defaultdict

class Splitwise:
    def __init__(self):
        self.balances = defaultdict(lambda: defaultdict(float))

    def split_equal(self, payer: str, amount: float, participants: list):
        split = amount / len(participants)
        for p in participants:
            if p != payer:
                self.balances[p][payer] += split
        print(f"💰 \${amount:.2f} paid by {payer} split across {len(participants)} people.")

    def show(self):
        for borrower, debts in self.balances.items():
            for lender, amt in debts.items():
                print(f"👉 {borrower} owes {lender}: \${amt:.2f}")

if __name__ == "__main__":
    sw = Splitwise()
    sw.split_equal("Alice", 60.0, ["Alice", "Bob", "Charlie"])
    sw.show()`
};

// ─────────────────────────────────────────────────────────────
// 18. ELEVATOR SYSTEM
// ─────────────────────────────────────────────────────────────
batch2["elevator-system"] = {
  java: `import java.util.*;

enum Direction { UP, DOWN, IDLE }

class Elevator {
    private final int id;
    private int currentFloor = 1;
    private Direction direction = Direction.IDLE;
    private final TreeSet<Integer> upStops = new TreeSet<>();
    private final TreeSet<Integer> downStops = new TreeSet<>(Collections.reverseOrder());

    public Elevator(int id) { this.id = id; }

    public synchronized void addDestination(int floor) {
        if (floor > currentFloor) {
            upStops.add(floor);
            if (direction == Direction.IDLE) direction = Direction.UP;
        } else if (floor < currentFloor) {
            downStops.add(floor);
            if (direction == Direction.IDLE) direction = Direction.DOWN;
        }
        System.out.println("Elevator #" + id + " scheduled for floor " + floor);
    }

    public synchronized void step() {
        if (direction == Direction.UP) {
            if (!upStops.isEmpty()) {
                currentFloor = upStops.pollFirst();
                System.out.println("🛗 Elevator #" + id + " arrived at Floor " + currentFloor + " (Moving UP)");
            }
            if (upStops.isEmpty()) {
                direction = downStops.isEmpty() ? Direction.IDLE : Direction.DOWN;
            }
        } else if (direction == Direction.DOWN) {
            if (!downStops.isEmpty()) {
                currentFloor = downStops.pollFirst();
                System.out.println("🛗 Elevator #" + id + " arrived at Floor " + currentFloor + " (Moving DOWN)");
            }
            if (downStops.isEmpty()) {
                direction = upStops.isEmpty() ? Direction.IDLE : Direction.UP;
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Elevator elevator = new Elevator(1);
        elevator.addDestination(5);
        elevator.addDestination(3);
        elevator.addDestination(2);

        elevator.step();
        elevator.step();
        elevator.step();
    }
}`,
  cpp: `#include <iostream>
#include <set>

class Elevator {
    int floor = 1;
    std::set<int> upRequests;
public:
    void request(int f) {
        upRequests.insert(f);
    }
    void step() {
        if (!upRequests.empty()) {
            floor = *upRequests.begin();
            upRequests.erase(upRequests.begin());
            std::cout << "Elevator arrived at floor " << floor << "\\n";
        }
    }
};

int main() {
    Elevator e;
    e.request(3);
    e.request(7);
    e.step();
    e.step();
    return 0;
}`,
  python: `class Elevator:
    def __init__(self, eid: int = 1):
        self.id = eid
        self.current_floor = 1
        self.targets = []

    def press_floor(self, floor: int):
        if floor not in self.targets:
            self.targets.append(floor)
            self.targets.sort()
            print(f"🛗 Elevator #{self.id} requested for floor {floor}")

    def step(self):
        if self.targets:
            self.current_floor = self.targets.pop(0)
            print(f"🔔 Elevator #{self.id} arrived at Floor {self.current_floor}")

if __name__ == "__main__":
    e = Elevator(1)
    e.press_floor(4)
    e.press_floor(2)
    e.step()
    e.step()`
};

let count = 0;
lldData.forEach((q) => {
  if (batch2[q.slug]) {
    q.languages = batch2[q.slug];
    count++;
  }
});

fs.writeFileSync(lldPath, JSON.stringify(lldData, null, 2), "utf-8");
console.log(`Successfully updated batch 2: ${count} questions.`);
