export type PatternCategory = "Creational" | "Structural" | "Behavioral" | "Concurrency";

export interface PatternExampleCode {
  java: string;
  typescript: string;
  python: string;
}

export interface DesignPattern {
  id: string;
  slug: string;
  name: string;
  category: PatternCategory;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "CRITICAL";
  readTimeMinutes: number;
  oneLiner: string;
  metaphor: string;
  realWorldUsage: string[];
  intent: string;
  problemSolved: string;
  solution: string;
  
  // Interactive Simulator Configuration
  interactiveType: "strategy" | "observer" | "builder" | "decorator" | "chain" | "state" | "factory" | "singleton";
  
  // Scribble structure nodes
  structure: {
    participants: Array<{
      name: string;
      role: string;
      type: "interface" | "class" | "client";
    }>;
    relationships: string[];
  };

  code: PatternExampleCode;

  whenToUse: string[];
  whenToAvoid: string[];
  tradeoffs: {
    pros: string[];
    cons: string[];
  };
  interviewTips: string[];
}

export const DESIGN_PATTERNS: DesignPattern[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. CREATIONAL PATTERNS
  // ─────────────────────────────────────────────────────────────
  {
    id: "factory-method",
    slug: "factory-method",
    name: "Factory Method",
    category: "Creational",
    difficulty: "BEGINNER",
    readTimeMinutes: 7,
    oneLiner: "Defines an interface for creating an object, but lets subclasses decide which class to instantiate.",
    metaphor: "A logistics company dispatch center: the core logistics system asks for a 'Transport', while sub-departments dispatch Trucks, Ships, or Planes depending on terrain.",
    realWorldUsage: [
      "java.util.Calendar.getInstance()",
      "Spring Framework BeanFactory",
      "LoggerFactory.getLogger(Class)",
      "Document creator in text editors"
    ],
    intent: "Create objects without specifying the exact class of object that will be created.",
    problemSolved: "Coupling client code directly to concrete classes. If you instantiate `new Truck()` everywhere, adding `Ship` requires modifying every single callsite.",
    solution: "Define a creator factory method. Concrete creators override this method to return specific implementations of the product interface.",
    interactiveType: "factory",
    structure: {
      participants: [
        { name: "Transport (Interface)", role: "Common product interface with deliver()", type: "interface" },
        { name: "Truck / Ship (Concrete)", role: "Concrete implementations of Transport", type: "class" },
        { name: "Logistics (Creator)", role: "Declares factory method createTransport()", type: "class" },
        { name: "RoadLogistics / SeaLogistics", role: "Overrides factory method to return Truck or Ship", type: "class" }
      ],
      relationships: [
        "Logistics defines createTransport()",
        "RoadLogistics returns new Truck()",
        "Client calls logistics.planDelivery() without knowing the transport vehicle"
      ]
    },
    code: {
      java: `// 1. Product Interface
public interface Transport {
    String deliver();
}

// 2. Concrete Products
public class Truck implements Transport {
    @Override
    public String deliver() {
        return "Delivering cargo by land in heavy box truck (ETA: 4h)";
    }
}

public class Ship implements Transport {
    @Override
    public String deliver() {
        return "Delivering shipping container across sea route (ETA: 48h)";
    }
}

// 3. Creator
public abstract class Logistics {
    // The Factory Method
    public abstract Transport createTransport();

    public String planDelivery() {
        Transport transport = createTransport();
        return "Logistics Dispatch: " + transport.deliver();
    }
}

// 4. Concrete Creators
public class RoadLogistics extends Logistics {
    @Override
    public Transport createTransport() {
        return new Truck();
    }
}

public class SeaLogistics extends Logistics {
    @Override
    public Transport createTransport() {
        return new Ship();
    }
}`,
      typescript: `interface Transport {
  deliver(): string;
}

class Truck implements Transport {
  deliver(): string {
    return "Delivering cargo by land in heavy box truck (ETA: 4h)";
  }
}

class Ship implements Transport {
  deliver(): string {
    return "Delivering shipping container across sea route (ETA: 48h)";
  }
}

abstract class Logistics {
  abstract createTransport(): Transport;

  planDelivery(): string {
    const transport = this.createTransport();
    return \`Logistics Dispatch: \${transport.deliver()}\`;
  }
}

class RoadLogistics extends Logistics {
  createTransport(): Transport {
    return new Truck();
  }
}

class SeaLogistics extends Logistics {
  createTransport(): Transport {
    return new Ship();
  }
}`,
      python: `from abc import ABC, abstractmethod

class Transport(ABC):
    @abstractmethod
    def deliver(self) -> str:
        pass

class Truck(Transport):
    def deliver(self) -> str:
        return "Delivering cargo by land in heavy box truck (ETA: 4h)"

class Ship(Transport):
    def deliver(self) -> str:
        return "Delivering shipping container across sea route (ETA: 48h)"

class Logistics(ABC):
    @abstractmethod
    def create_transport(self) -> Transport:
        pass

    def plan_delivery(self) -> str:
        transport = self.create_transport()
        return f"Logistics Dispatch: {transport.deliver()}"

class RoadLogistics(Logistics):
    def create_transport(self) -> Transport:
        return Truck()

class SeaLogistics(Logistics):
    def create_transport(self) -> Transport:
        return Ship()`
    },
    whenToUse: [
      "When you do not know beforehand the exact types and dependencies of objects your code should work with.",
      "When you want to provide users of your library or framework with a way to extend its internal components.",
      "When you want to save system resources by reusing existing objects instead of rebuilding them each time."
    ],
    whenToAvoid: [
      "When the creation logic is trivial and will never change (simple `new` is fine).",
      "When you have only one concrete product and no anticipated variants."
    ],
    tradeoffs: {
      pros: [
        "Avoids tight coupling between the creator and the concrete products.",
        "Single Responsibility Principle: creator code lives in one place.",
        "Open/Closed Principle: introduce new product variants without breaking existing client code."
      ],
      cons: [
        "Code may become more complicated since you need to introduce new subclasses for each product."
      ]
    },
    interviewTips: [
      "Contrast Factory Method with Abstract Factory: Factory Method creates a single product; Abstract Factory creates families of related products.",
      "Mention Spring's `@Bean` methods as modern real-world examples of Factory Methods."
    ]
  },
  {
    id: "abstract-factory",
    slug: "abstract-factory",
    name: "Abstract Factory",
    category: "Creational",
    difficulty: "INTERMEDIATE",
    readTimeMinutes: 8,
    oneLiner: "Provides an interface for creating families of related or dependent objects without specifying their concrete classes.",
    metaphor: "A modern furniture store with Victorian, Modern, and Art Deco lines. Ordering a 'Sofa + Chair + CoffeeTable' from ModernFactory guarantees all 3 pieces match in style.",
    realWorldUsage: [
      "Cross-platform GUI toolkits (Windows vs macOS button, checkbox, scrollbar)",
      "Multi-cloud storage & compute adapters (AWS vs Azure vs GCP)",
      "Database dialect drivers (PostgreSQL vs MySQL vs Oracle connection, command, transaction)"
    ],
    intent: "Create complete families of matching products without coupling to concrete classes.",
    problemSolved: "Preventing mismatched components (e.g. putting a Victorian Gothic chair in a Minimalist Scandinavian living room or combining a Windows button with a macOS scrollbar).",
    solution: "Declare an abstract factory interface with a creation method for each distinct product type in the family.",
    interactiveType: "factory",
    structure: {
      participants: [
        { name: "GUIFactory (Interface)", role: "Declares createButton() and createCheckbox()", type: "interface" },
        { name: "WinFactory / MacFactory", role: "Implements creation for Windows or macOS components", type: "class" },
        { name: "Button / Checkbox (Interfaces)", role: "Abstract product families", type: "interface" },
        { name: "WinButton, MacButton, etc.", role: "Concrete implementations", type: "class" }
      ],
      relationships: [
        "Client receives GUIFactory via dependency injection",
        "Client instantiates matched Button + Checkbox through the same factory instance"
      ]
    },
    code: {
      java: `// Product Families
public interface Button { void render(); }
public interface Checkbox { void render(); }

// Concrete Windows Products
public class WinButton implements Button {
    public void render() { System.out.println("Rendering Windows Flat UI Button"); }
}
public class WinCheckbox implements Checkbox {
    public void render() { System.out.println("Rendering Windows Metro Checkbox"); }
}

// Concrete Mac Products
public class MacButton implements Button {
    public void render() { System.out.println("Rendering macOS Aqua Rounded Button"); }
}
public class MacCheckbox implements Checkbox {
    public void render() { System.out.println("Rendering macOS Blue Accent Checkbox"); }
}

// Abstract Factory
public interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// Concrete Factories
public class WinFactory implements GUIFactory {
    public Button createButton() { return new WinButton(); }
    public Checkbox createCheckbox() { return new WinCheckbox(); }
}

public class MacFactory implements GUIFactory {
    public Button createButton() { return new MacButton(); }
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}`,
      typescript: `interface Button { render(): string; }
interface Checkbox { render(): string; }

class WinButton implements Button {
  render() { return "Rendering Windows Metro Button"; }
}
class WinCheckbox implements Checkbox {
  render() { return "Rendering Windows Square Checkbox"; }
}

class MacButton implements Button {
  render() { return "Rendering macOS Pill Button"; }
}
class MacCheckbox implements Checkbox {
  render() { return "Rendering macOS Rounded Checkbox"; }
}

interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class WinFactory implements GUIFactory {
  createButton() { return new WinButton(); }
  createCheckbox() { return new WinCheckbox(); }
}

class MacFactory implements GUIFactory {
  createButton() { return new MacButton(); }
  createCheckbox() { return new MacCheckbox(); }
}`,
      python: `from abc import ABC, abstractmethod

class Button(ABC):
    @abstractmethod
    def render(self) -> str: pass

class Checkbox(ABC):
    @abstractmethod
    def render(self) -> str: pass

class WinButton(Button):
    def render(self): return "Rendering Windows Metro Button"

class MacButton(Button):
    def render(self): return "Rendering macOS Pill Button"

class GUIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button: pass
    @abstractmethod
    def create_checkbox(self) -> Checkbox: pass

class WinFactory(GUIFactory):
    def create_button(self): return WinButton()
    def create_checkbox(self): pass`
    },
    whenToUse: [
      "When your system must be independent of how its products are created, composed, and represented.",
      "When your system needs to be configured with one of multiple product families.",
      "When you want to enforce that products from the same family are used together."
    ],
    whenToAvoid: [
      "When you only have a single product line that will never branch into variants.",
      "When adding new products to the family is frequent (requires updating all concrete factories)."
    ],
    tradeoffs: {
      pros: [
        "Guarantees compatibility between products created by the factory.",
        "Avoids tight coupling between concrete products and client code.",
        "Single Responsibility: product creation is isolated."
      ],
      cons: [
        "Extending the interface to add a new product requires modifying every concrete factory class."
      ]
    },
    interviewTips: [
      "Interviewers love asking how to add a third cloud provider (e.g. GCP) to an existing AWS/Azure Abstract Factory.",
      "Explain how Abstract Factory relates to Dependency Injection: you inject the factory into client constructors."
    ]
  },
  {
    id: "builder-pattern",
    slug: "builder-pattern",
    name: "Builder Pattern",
    category: "Creational",
    difficulty: "BEGINNER",
    readTimeMinutes: 7,
    oneLiner: "Separates the construction of a complex object from its representation, allowing the same construction process to create different representations.",
    metaphor: "Customizing a pizza or building a custom gaming PC. Rather than passing 18 parameters to a giant constructor (`new PC(cpu, gpu, ram, rgb, liquidCooling...)`), you assemble parts step-by-step.",
    realWorldUsage: [
      "java.lang.StringBuilder / StringBuffer",
      "Lombok `@Builder` annotation",
      "HTTP Request builders (e.g. Java 11 `HttpRequest.newBuilder()`)",
      "SQL Query Builders (Knex.js, JOOQ, Hibernate CriteriaBuilder)"
    ],
    intent: "Construct complex objects step-by-step and produce immutable result instances.",
    problemSolved: "The Telescoping Constructor anti-pattern where a class has 7 constructors with varying optional parameters, making code unreadable and prone to parameter swapping bugs.",
    solution: "Extract object construction code into a separate Builder class with fluent chainable setter methods and a final `build()` validation method.",
    interactiveType: "builder",
    structure: {
      participants: [
        { name: "Product (Immutable)", role: "Complex object with private constructor", type: "class" },
        { name: "Builder", role: "Contains matching fields and fluent chainable methods", type: "class" },
        { name: "build() method", role: "Validates constraints and instantiates the product", type: "class" }
      ],
      relationships: [
        "Client chains builder.setA().setB().build()",
        "Product has no public setters, making it thread-safe and immutable"
      ]
    },
    code: {
      java: `// Immutable Product with Static Nested Builder
public final class Computer {
    private final String cpu;
    private final int ramGb;
    private final String gpu;
    private final boolean liquidCooling;
    private final boolean wifi;

    private Computer(Builder builder) {
        this.cpu = builder.cpu;
        this.ramGb = builder.ramGb;
        this.gpu = builder.gpu;
        this.liquidCooling = builder.liquidCooling;
        this.wifi = builder.wifi;
    }

    public static class Builder {
        // Required parameters
        private final String cpu;
        private final int ramGb;

        // Optional parameters initialized to defaults
        private String gpu = "Integrated Graphics";
        private boolean liquidCooling = false;
        private boolean wifi = true;

        public Builder(String cpu, int ramGb) {
            this.cpu = cpu;
            this.ramGb = ramGb;
        }

        public Builder gpu(String gpu) {
            this.gpu = gpu;
            return this;
        }

        public Builder liquidCooling(boolean liquidCooling) {
            this.liquidCooling = liquidCooling;
            return this;
        }

        public Builder wifi(boolean wifi) {
            this.wifi = wifi;
            return this;
        }

        public Computer build() {
            // Validate business invariant rules
            if (liquidCooling && ramGb < 16) {
                throw new IllegalStateException("Liquid cooling requires >= 16GB RAM");
            }
            return new Computer(this);
        }
    }
}`,
      typescript: `export class Computer {
  readonly cpu: string;
  readonly ramGb: number;
  readonly gpu: string;
  readonly liquidCooling: boolean;
  readonly wifi: boolean;

  constructor(builder: ComputerBuilder) {
    this.cpu = builder.cpu;
    this.ramGb = builder.ramGb;
    this.gpu = builder.gpu;
    this.liquidCooling = builder.liquidCooling;
    this.wifi = builder.wifi;
  }
}

export class ComputerBuilder {
  cpu: string;
  ramGb: number;
  gpu = "Integrated Graphics";
  liquidCooling = false;
  wifi = true;

  constructor(cpu: string, ramGb: number) {
    this.cpu = cpu;
    this.ramGb = ramGb;
  }

  setGpu(gpu: string): this {
    this.gpu = gpu;
    return this;
  }

  setLiquidCooling(enabled: boolean): this {
    this.liquidCooling = enabled;
    return this;
  }

  setWifi(enabled: boolean): this {
    this.wifi = enabled;
    return this;
  }

  build(): Computer {
    if (this.liquidCooling && this.ramGb < 16) {
      throw new Error("Liquid cooling requires at least 16GB RAM");
    }
    return new Computer(this);
  }
}`,
      python: `class Computer:
    def __init__(self, builder):
        self.cpu = builder.cpu
        self.ram_gb = builder.ram_gb
        self.gpu = builder.gpu
        self.liquid_cooling = builder.liquid_cooling
        self.wifi = builder.wifi

class ComputerBuilder:
    def __init__(self, cpu: str, ram_gb: int):
        self.cpu = cpu
        self.ram_gb = ram_gb
        self.gpu = "Integrated Graphics"
        self.liquid_cooling = False
        self.wifi = True

    def set_gpu(self, gpu: str):
        self.gpu = gpu
        return self

    def set_liquid_cooling(self, enabled: bool):
        self.liquid_cooling = enabled
        return self

    def build(self) -> Computer:
        if self.liquid_cooling and self.ram_gb < 16:
            raise ValueError("Liquid cooling requires >= 16GB RAM")
        return Computer(self)`
    },
    whenToUse: [
      "To avoid the 'telescoping constructor' with 4+ optional parameters.",
      "When creating an immutable domain object that cannot have public setters.",
      "When the object creation process must be step-by-step or deferred."
    ],
    whenToAvoid: [
      "When objects are simple data transfer objects (DTOs) with 1 or 2 fields.",
      "When mutability is explicitly desired and no complex validation invariants exist."
    ],
    tradeoffs: {
      pros: [
        "Construct objects step-by-step, defer construction steps or run steps recursively.",
        "Enforces immutability: the target object has no setters.",
        "Single Responsibility: separates construction from business logic."
      ],
      cons: [
        "Increases code verbosity since you must define the builder class alongside the product."
      ]
    },
    interviewTips: [
      "Explain how Builder enforces immutability and thread safety in concurrent environments.",
      "Demonstrate validation inside `build()`: constructor parameters are verified atomically before object instantiation."
    ]
  },
  {
    id: "singleton-pattern",
    slug: "singleton-pattern",
    name: "Singleton Pattern",
    category: "Creational",
    difficulty: "BEGINNER",
    readTimeMinutes: 6,
    oneLiner: "Ensures a class has only one instance and provides a global point of access to it.",
    metaphor: "The President of a country: there can only be one official president at any given time, accessible to all government departments.",
    realWorldUsage: [
      "java.lang.Runtime.getRuntime()",
      "Database connection pools (HikariCP DataSource)",
      "Hardware drivers (Printer spooler, GPU context)",
      "Spring default bean scope (`@Scope(\"singleton\")`)"
    ],
    intent: "Ensure a class only ever has a single instance in the entire JVM/process lifetime.",
    problemSolved: "Multiple parts of an application creating competing instances of a shared resource (like database connection pool or logger file lock), causing conflicts.",
    solution: "Private constructor + static variable holding the instance + public thread-safe `getInstance()` method.",
    interactiveType: "singleton",
    structure: {
      participants: [
        { name: "Singleton Class", role: "Has private constructor and private static instance", type: "class" },
        { name: "getInstance()", role: "Thread-safe accessor (Double-checked locking or Bill Pugh)", type: "class" }
      ],
      relationships: [
        "Constructor is private",
        "Clients invoke Singleton.getInstance() to retrieve the shared instance"
      ]
    },
    code: {
      java: `// 1. Thread-Safe Double-Checked Locking (Optimized for performance)
public class DatabaseConnectionPool {
    // volatile prevents instruction reordering in multithreaded JVM
    private static volatile DatabaseConnectionPool instance;

    private DatabaseConnectionPool() {
        // Prevent reflection instantiation attack
        if (instance != null) {
            throw new IllegalStateException("Already instantiated!");
        }
    }

    public static DatabaseConnectionPool getInstance() {
        if (instance == null) { // First check (no locking overhead)
            synchronized (DatabaseConnectionPool.class) {
                if (instance == null) { // Second check (synchronized)
                    instance = new DatabaseConnectionPool();
                }
            }
        }
        return instance;
    }
}

// 2. Bill Pugh Singleton (Lazy initialization via static inner class)
public class BillPughSingleton {
    private BillPughSingleton() {}

    private static class HelperHolder {
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }

    public static BillPughSingleton getInstance() {
        return HelperHolder.INSTANCE; // Loaded on-demand when called
    }
}`,
      typescript: `export class DatabasePool {
  private static instance: DatabasePool;
  private connections = 10;

  private constructor() {
    // Private prevents direct new DatabasePool()
  }

  public static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }

  public query(sql: string): string {
    return \`Executing "\${sql}" on shared pool (Active: \${this.connections})\`;
  }
}`,
      python: `class DatabasePool:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabasePool, cls).__new__(cls)
            cls._instance.connections = 10
        return cls._instance`
    },
    whenToUse: [
      "When exactly one instance of a class is needed to coordinate actions across the system (e.g. database pool, cache manager, audio driver).",
      "When strict control over global variables is needed."
    ],
    whenToAvoid: [
      "As a lazy replacement for passing parameters (turns into an anti-pattern).",
      "In unit tests when mockability and test isolation are critical (singletons introduce global state)."
    ],
    tradeoffs: {
      pros: [
        "Guaranteed exactly one instance.",
        "Lazy initialization: created only when first requested.",
        "Controlled access to sole instance."
      ],
      cons: [
        "Violates Single Responsibility Principle (controls its own lifecycle AND business logic).",
        "Makes unit testing difficult because state leaks across test suites."
      ]
    },
    interviewTips: [
      "Always explain why `volatile` is mandatory in Double-Checked Locking (prevents instruction reordering).",
      "Know the Enum Singleton (Josh Bloch pattern) as the cleanest reflection-proof and serialization-safe implementation in Java."
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 2. STRUCTURAL PATTERNS
  // ─────────────────────────────────────────────────────────────
  {
    id: "adapter-pattern",
    slug: "adapter-pattern",
    name: "Adapter Pattern",
    category: "Structural",
    difficulty: "BEGINNER",
    readTimeMinutes: 7,
    oneLiner: "Allows objects with incompatible interfaces to collaborate by converting the interface of one object into another.",
    metaphor: "A US-to-UK power plug adapter. The UK wall socket and the US laptop plug are incompatible, but the adapter bridges them without modifying the wall or the laptop.",
    realWorldUsage: [
      "java.util.Arrays.asList()",
      "InputStreamReader (adapts InputStream to Reader)",
      "Payment gateway wrappers (adapting Stripe & PayPal to a unified PaymentGateway interface)",
      "Legacy SOAP XML to REST JSON bridge"
    ],
    intent: "Convert the interface of an existing class into another interface that clients expect.",
    problemSolved: "Integrating a 3rd-party library, legacy service, or hardware device whose method signatures do not match your application's domain interfaces.",
    solution: "Create an Adapter class that implements the client interface and wraps the incompatible Adaptee instance.",
    interactiveType: "chain",
    structure: {
      participants: [
        { name: "Client Interface", role: "Defines the domain protocol your app uses", type: "interface" },
        { name: "Adaptee (3rd Party)", role: "Existing incompatible class", type: "class" },
        { name: "Adapter", role: "Implements Client Interface and delegates to Adaptee", type: "class" }
      ],
      relationships: [
        "Client calls adapter.processPayment(amountInDollars)",
        "Adapter converts amount to cents and calls adaptee.chargeCreditCard(cents)"
      ]
    },
    code: {
      java: `// 1. Client Domain Interface
public interface PaymentProcessor {
    void pay(double dollars);
}

// 2. Incompatible Third-Party Adaptee (e.g. Legacy Stripe SDK)
public class LegacyStripeGateway {
    public void executeCharge(long cents, String currency) {
        System.out.println("Charged " + cents + " " + currency + " via Legacy Stripe");
    }
}

// 3. Adapter
public class StripePaymentAdapter implements PaymentProcessor {
    private final LegacyStripeGateway stripeGateway;

    public StripePaymentAdapter(LegacyStripeGateway stripeGateway) {
        this.stripeGateway = stripeGateway;
    }

    @Override
    public void pay(double dollars) {
        // Convert client format (dollars) to adaptee format (cents)
        long cents = (long) (dollars * 100);
        stripeGateway.executeCharge(cents, "USD");
    }
}`,
      typescript: `interface PaymentProcessor {
  pay(dollars: number): string;
}

// Incompatible external SDK
class LegacyStripeGateway {
  executeCharge(cents: number, currency: string): string {
    return \`Charged \${cents} \${currency} via Legacy Stripe SDK\`;
  }
}

// Adapter
class StripeAdapter implements PaymentProcessor {
  constructor(private legacyStripe: LegacyStripeGateway) {}

  pay(dollars: number): string {
    const cents = Math.round(dollars * 100);
    return this.legacyStripe.executeCharge(cents, "USD");
  }
}`,
      python: `class PaymentProcessor:
    def pay(self, dollars: float) -> str: pass

class LegacyStripeGateway:
    def execute_charge(self, cents: int, currency: str) -> str:
        return f"Charged {cents} {currency} via Legacy Stripe"

class StripeAdapter(PaymentProcessor):
    def __init__(self, legacy_stripe: LegacyStripeGateway):
        self.legacy_stripe = legacy_stripe

    def pay(self, dollars: float) -> str:
        cents = int(dollars * 100)
        return self.legacy_stripe.execute_charge(cents, "USD")`
    },
    whenToUse: [
      "When you want to use an existing class, but its interface does not match the rest of your code.",
      "When you want to reuse several existing subclasses that lack common functionality, without subclassing each one."
    ],
    whenToAvoid: [
      "When you have full control over the source code of both classes and can simply refactor them directly."
    ],
    tradeoffs: {
      pros: [
        "Single Responsibility: separates interface/data conversion code from primary business logic.",
        "Open/Closed: introduce new adapters without breaking existing client code."
      ],
      cons: [
        "Increases overall code complexity as you introduce new interfaces and wrapper classes."
      ]
    },
    interviewTips: [
      "Distinguish Object Adapter (composition - preferred) vs Class Adapter (multiple inheritance).",
      "Mention Java's `InputStreamReader` as the textbook standard library adapter."
    ]
  },
  {
    id: "decorator-pattern",
    slug: "decorator-pattern",
    name: "Decorator Pattern",
    category: "Structural",
    difficulty: "INTERMEDIATE",
    readTimeMinutes: 8,
    oneLiner: "Attaches additional responsibilities to an object dynamically, providing a flexible alternative to subclassing.",
    metaphor: "Putting on clothes in cold weather. You put on a base shirt, then wrap yourself in a warm sweater, then wrap a raincoat over that. Each layer adds a behavior without altering your core body.",
    realWorldUsage: [
      "java.io stream wrappers: `new BufferedReader(new FileReader(\"data.txt\"))`",
      "Spring Security filter chains (`SecurityFilterChain`)",
      "HTTP request compression/caching wrappers in Axios or Express middlewares",
      "Text formatting (bold, italic, strikethrough decorators)"
    ],
    intent: "Add dynamic behaviors and responsibilities to individual objects without altering the underlying class.",
    problemSolved: "Class explosion caused by subclassing every combination of features (e.g. `EspressoWithMilkAndCaramel`, `EspressoWithWhip`, `EspressoWithMilkAndWhip...`).",
    solution: "Wrap objects in decorator classes that implement the same interface and delegate calls to the wrapped instance while adding extra behavior.",
    interactiveType: "decorator",
    structure: {
      participants: [
        { name: "Coffee (Component)", role: "Common interface defining cost() and description()", type: "interface" },
        { name: "SimpleCoffee (Concrete Component)", role: "Base implementation ($2.00)", type: "class" },
        { name: "CoffeeDecorator (Abstract Decorator)", role: "Maintains reference to wrapped Coffee", type: "class" },
        { name: "MilkDecorator, CaramelDecorator", role: "Adds cost and appends description", type: "class" }
      ],
      relationships: [
        "CoffeeDecorator implements Coffee and contains a Coffee instance",
        "Calls cascade recursively down the decorator chain"
      ]
    },
    code: {
      java: `// 1. Component Interface
public interface Beverage {
    String getDescription();
    double getCost();
}

// 2. Concrete Component
public class Espresso implements Beverage {
    public String getDescription() { return "Dark Roast Espresso"; }
    public double getCost() { return 2.50; }
}

// 3. Base Decorator
public abstract class CondimentDecorator implements Beverage {
    protected final Beverage wrappedBeverage;

    public CondimentDecorator(Beverage beverage) {
        this.wrappedBeverage = beverage;
    }
}

// 4. Concrete Decorators
public class Milk extends CondimentDecorator {
    public Milk(Beverage beverage) { super(beverage); }

    public String getDescription() { return wrappedBeverage.getDescription() + " + Steamed Milk"; }
    public double getCost() { return wrappedBeverage.getCost() + 0.50; }
}

public class CaramelDrizzle extends CondimentDecorator {
    public CaramelDrizzle(Beverage beverage) { super(beverage); }

    public String getDescription() { return wrappedBeverage.getDescription() + " + Sweet Caramel"; }
    public double getCost() { return wrappedBeverage.getCost() + 0.75; }
}

// Usage:
// Beverage myDrink = new CaramelDrizzle(new Milk(new Espresso()));
// Cost: $2.50 + $0.50 + $0.75 = $3.75!`,
      typescript: `interface Beverage {
  getDescription(): string;
  getCost(): number;
}

class Espresso implements Beverage {
  getDescription() { return "Espresso"; }
  getCost() { return 2.50; }
}

abstract class CondimentDecorator implements Beverage {
  constructor(protected beverage: Beverage) {}
  abstract getDescription(): string;
  abstract getCost(): number;
}

class Milk extends CondimentDecorator {
  getDescription() { return \`\${this.beverage.getDescription()} + Milk\`; }
  getCost() { return this.beverage.getCost() + 0.50; }
}

class Caramel extends CondimentDecorator {
  getDescription() { return \`\${this.beverage.getDescription()} + Caramel\`; }
  getCost() { return this.beverage.getCost() + 0.75; }
}`,
      python: `class Beverage:
    def get_description(self) -> str: pass
    def get_cost(self) -> float: pass

class Espresso(Beverage):
    def get_description(self): return "Espresso"
    def get_cost(self): return 2.50

class CondimentDecorator(Beverage):
    def __init__(self, beverage: Beverage):
        self._beverage = beverage

class Milk(CondimentDecorator):
    def get_description(self):
        return f"{self._beverage.get_description()} + Milk"
    def get_cost(self):
        return self._beverage.get_cost() + 0.50`
    },
    whenToUse: [
      "When you want to add responsibilities to individual objects dynamically and transparently without affecting other objects.",
      "When extension by subclassing is impractical or causes combinatorial explosion.",
      "When you need to withdraw or re-order responsibilities dynamically at runtime."
    ],
    whenToAvoid: [
      "When the component interface has dozens of methods (decorators must pass-through all of them).",
      "When code relies on strict `instanceof` checks on the concrete underlying type."
    ],
    tradeoffs: {
      pros: [
        "Greater flexibility than static inheritance.",
        "Add or remove responsibilities dynamically at runtime.",
        "Combine multiple decorators freely in any order."
      ],
      cons: [
        "Hard to remove a specific decorator from the middle of a deep stack.",
        "Decorators can introduce subtle debugging challenges due to deep call stacks."
      ]
    },
    interviewTips: [
      "Compare Decorator vs Proxy: Decorator enhances behavior and interface composition; Proxy controls access or manages lifecycle.",
      "Show how `java.io.BufferedReader` wrapping `FileReader` is the canonical JDK decorator."
    ]
  },
  {
    id: "facade-pattern",
    slug: "facade-pattern",
    name: "Facade Pattern",
    category: "Structural",
    difficulty: "BEGINNER",
    readTimeMinutes: 6,
    oneLiner: "Provides a simplified, unified interface to a complex subsystem of classes, libraries, or frameworks.",
    metaphor: "A hotel concierge. You tell the concierge: 'Book me dinner and a theater ticket'. The concierge coordinates with restaurants, taxi drivers, and ticket vendors behind the scenes.",
    realWorldUsage: [
      "Spring Boot `@EnableAutoConfiguration` (facade over 50 Spring bean configurations)",
      "Database access facades (Repository pattern wrapping ORM, caching, and audit logging)",
      "Video conversion services (wrapping audio encoders, video decoders, bitrate compressors)",
      "CheckoutFacade in E-commerce (coordinating InventoryService, PaymentGateway, NotificationService, ShippingService)"
    ],
    intent: "Provide a clean, high-level interface that makes a complex subsystem easy to use.",
    problemSolved: "Client code getting tangled in dozens of interdependent subsystem classes, making it difficult to maintain and tightly coupling the client to low-level implementation details.",
    solution: "Introduce a Facade class that encapsulates subsystem coordination behind simple 1-line public methods.",
    interactiveType: "chain",
    structure: {
      participants: [
        { name: "Facade", role: "Provides simple methods like bookOrder() or convertVideo()", type: "class" },
        { name: "Subsystem Classes (A, B, C, D)", role: "Complex underlying engines", type: "class" },
        { name: "Client", role: "Interacts ONLY with the Facade", type: "client" }
      ],
      relationships: [
        "Client calls facade.checkout(cart)",
        "Facade orchestrates Payment, Inventory, and Shipping engines in order"
      ]
    },
    code: {
      java: `// Complex Subsystems
public class InventoryService {
    public boolean checkStock(String productId) { return true; }
    public void deduct(String productId) { System.out.println("Stock deducted"); }
}

public class PaymentGateway {
    public boolean charge(String userId, double amount) {
        System.out.println("Charged $" + amount + " to user: " + userId);
        return true;
    }
}

public class NotificationService {
    public void sendOrderConfirmation(String userId) {
        System.out.println("Email receipt sent to " + userId);
    }
}

// Clean Production Facade
public class OrderCheckoutFacade {
    private final InventoryService inventory = new InventoryService();
    private final PaymentGateway payment = new PaymentGateway();
    private final NotificationService notifier = new NotificationService();

    public boolean placeOrder(String userId, String productId, double price) {
        if (!inventory.checkStock(productId)) return false;
        
        boolean charged = payment.charge(userId, price);
        if (!charged) return false;

        inventory.deduct(productId);
        notifier.sendOrderConfirmation(userId);
        return true; // Simplified 1-line call for the client!
    }
}`,
      typescript: `class InventoryService {
  deduct(item: string) { return \`Deducted \${item}\`; }
}
class PaymentService {
  charge(amount: number) { return \`Charged $\${amount}\`; }
}
class EmailService {
  sendReceipt() { return "Receipt dispatched"; }
}

export class OrderFacade {
  private inv = new InventoryService();
  private pay = new PaymentService();
  private email = new EmailService();

  checkout(item: string, price: number): string[] {
    return [
      this.inv.deduct(item),
      this.pay.charge(price),
      this.email.sendReceipt()
    ];
  }
}`,
      python: `class OrderFacade:
    def __init__(self):
        self.inv = InventoryService()
        self.pay = PaymentService()
        self.email = EmailService()

    def checkout(self, item: str, price: float):
        self.inv.deduct(item)
        self.pay.charge(price)
        self.email.send_receipt()
        return "Order completed successfully"`
    },
    whenToUse: [
      "To provide a simple, default interface to a complex subsystem.",
      "To decouple client code from the inner workings of third-party libraries.",
      "To structure subsystems into distinct layered architectural tiers."
    ],
    whenToAvoid: [
      "When client code genuinely needs low-level fine-grained control over individual subsystem steps."
    ],
    tradeoffs: {
      pros: [
        "Isolates your code from the complexity of a subsystem.",
        "Promotes loose coupling between clients and subsystem components."
      ],
      cons: [
        "A facade can risk becoming an all-knowing 'God Object' if not scoped properly."
      ]
    },
    interviewTips: [
      "Contrast Facade vs Adapter: Facade defines a brand new simplified interface; Adapter matches an existing incompatible interface.",
      "Explain how Microservice API Gateways (BFF pattern) are essentially distributed Facades."
    ]
  },
  {
    id: "proxy-pattern",
    slug: "proxy-pattern",
    name: "Proxy Pattern",
    category: "Structural",
    difficulty: "INTERMEDIATE",
    readTimeMinutes: 7,
    oneLiner: "Provides a surrogate or placeholder for another object to control access to it.",
    metaphor: "A debit card is a proxy for your bank account cash. You swipe the card instead of carrying paper bills; the card authenticates you, verifies balance, and delegates to the real account.",
    realWorldUsage: [
      "Spring `@Transactional` and `@Cacheable` (CGLIB / JDK Dynamic Proxies)",
      "Hibernate Lazy-Loading proxies for entity relationships",
      "Reverse proxies (Nginx, Envoy) providing caching, SSL termination, and rate limiting",
      "Protection proxies (role-based access control before invoking sensitive service methods)"
    ],
    intent: "Provide a surrogate or placeholder for another object to control access, add caching, or defer expensive creation.",
    problemSolved: "Needing to add security checks, caching, lazy loading, or logging to an object without modifying the object's original code.",
    solution: "Create a Proxy that implements the same interface as the real subject, intercepts requests, performs auxiliary logic, and delegates to the real subject.",
    interactiveType: "chain",
    structure: {
      participants: [
        { name: "Subject (Interface)", role: "Common interface for RealSubject and Proxy", type: "interface" },
        { name: "RealSubject", role: "Performs the heavy/sensitive business logic", type: "class" },
        { name: "Proxy", role: "Controls access, caches results, or checks auth", type: "class" }
      ],
      relationships: [
        "Client interacts with Proxy via Subject interface",
        "Proxy intercepts call -> checks cache/auth -> forwards to RealSubject"
      ]
    },
    code: {
      java: `public interface VideoDownloader {
    byte[] downloadVideo(String videoUrl);
}

// Real Heavy Subject
public class YouTubeDownloader implements VideoDownloader {
    @Override
    public byte[] downloadVideo(String videoUrl) {
        System.out.println("Connecting to YouTube CDN, downloading high-res video: " + videoUrl);
        return new byte[1024]; // Simulating heavy 50MB download
    }
}

// Caching Proxy
public class CachedVideoProxy implements VideoDownloader {
    private final VideoDownloader realDownloader;
    private final Map<String, byte[]> memoryCache = new ConcurrentHashMap<>();

    public CachedVideoProxy(VideoDownloader realDownloader) {
        this.realDownloader = realDownloader;
    }

    @Override
    public byte[] downloadVideo(String videoUrl) {
        if (memoryCache.containsKey(videoUrl)) {
            System.out.println("CACHE HIT: Returning video bytes from memory cache.");
            return memoryCache.get(videoUrl);
        }

        System.out.println("CACHE MISS: Delegating to Real YouTube Downloader...");
        byte[] video = realDownloader.downloadVideo(videoUrl);
        memoryCache.put(videoUrl, video);
        return video;
    }
}`,
      typescript: `interface VideoService {
  fetch(id: string): string;
}

class RealVideoService implements VideoService {
  fetch(id: string) {
    return \`Downloaded 4K stream for video: \${id} (3500ms)\`;
  }
}

class CachedVideoProxy implements VideoService {
  private cache = new Map<string, string>();
  constructor(private service: VideoService) {}

  fetch(id: string): string {
    if (this.cache.has(id)) {
      return \`[CACHE HIT 0.2ms] \${this.cache.get(id)}\`;
    }
    const data = this.service.fetch(id);
    this.cache.set(id, data);
    return \`[CACHE MISS] \${data}\`;
  }
}`,
      python: `class VideoService:
    def fetch(self, id: str) -> str: pass

class RealVideoService(VideoService):
    def fetch(self, id: str) -> str:
        return f"Stream data for video: {id}"

class CachedVideoProxy(VideoService):
    def __init__(self, real_service: VideoService):
        self.real = real_service
        self.cache = {}

    def fetch(self, id: str) -> str:
        if id in self.cache:
            return f"[CACHE HIT] {self.cache[id]}"
        data = self.real.fetch(id)
        self.cache[id] = data
        return f"[CACHE MISS] {data}"`
    },
    whenToUse: [
      "Lazy loading (Virtual Proxy): creating a heavy object only when it is actually needed.",
      "Access control (Protection Proxy): checking permissions before delegating to the real object.",
      "Caching (Caching Proxy): storing expensive request results in memory.",
      "Logging / Auditing (Logging Proxy): keeping a trace of all calls to the subject."
    ],
    whenToAvoid: [
      "When direct access is already lightweight and no interceptor logic is needed."
    ],
    tradeoffs: {
      pros: [
        "Controls lifecycle and access of the service object without clients knowing.",
        "Open/Closed: introduce new proxies without changing the service or clients."
      ],
      cons: [
        "Adds an extra layer of indirection and minor latency."
      ]
    },
    interviewTips: [
      "Explain how Spring AOP uses JDK Dynamic Proxies (for interfaces) and CGLIB (for concrete classes) to implement `@Transactional`.",
      "Highlight how Hibernate lazy-loading uses proxies to prevent fetching deep database tables until a getter is called."
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 3. BEHAVIORAL PATTERNS
  // ─────────────────────────────────────────────────────────────
  {
    id: "strategy-pattern",
    slug: "strategy-pattern",
    name: "Strategy Pattern",
    category: "Behavioral",
    difficulty: "BEGINNER",
    readTimeMinutes: 7,
    oneLiner: "Defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.",
    metaphor: "Traveling to the airport. Depending on your budget and time, you can choose a strategy: taking the Subway, calling an Uber, or riding a Bicycle. The destination is the same, but the algorithm differs.",
    realWorldUsage: [
      "Payment processing (CreditCardStrategy, UpiStrategy, CryptoStrategy)",
      "Compression algorithms (ZipStrategy, TarStrategy, GzipStrategy)",
      "Sorting & routing algorithms in Google Maps (Fastest, Avoid Tolls, Eco-Friendly)",
      "java.util.Comparator.compare()"
    ],
    intent: "Allow swapping an object's business algorithm dynamically at runtime without modifying client classes.",
    problemSolved: "Giant `switch` or `if-else if-else` statements checking `paymentType == 'CREDIT_CARD'` scattered throughout the codebase.",
    solution: "Extract each algorithm into a separate strategy class that implements a common Strategy interface. The Context class delegates execution to its current strategy.",
    interactiveType: "strategy",
    structure: {
      participants: [
        { name: "PaymentStrategy (Interface)", role: "Declares pay(amount)", type: "interface" },
        { name: "CreditCard, UPI, PayPal", role: "Encapsulate specific payment algorithms", type: "class" },
        { name: "CheckoutContext", role: "Holds a reference to current Strategy and calls pay()", type: "class" }
      ],
      relationships: [
        "Client sets strategy on context: context.setStrategy(new UpiStrategy())",
        "Context delegates execution: strategy.pay(amount)"
      ]
    },
    code: {
      java: `// 1. Strategy Interface
public interface PaymentStrategy {
    void pay(double amount);
    String getName();
}

// 2. Concrete Strategies
public class CreditCardStrategy implements PaymentStrategy {
    private final String cardNumber;
    public CreditCardStrategy(String cardNumber) { this.cardNumber = cardNumber; }

    @Override
    public void pay(double amount) {
        System.out.println("Charged $" + amount + " to Credit Card ending in " + cardNumber.substring(cardNumber.length() - 4));
    }
    public String getName() { return "Credit Card"; }
}

public class UpiStrategy implements PaymentStrategy {
    private final String upiId;
    public UpiStrategy(String upiId) { this.upiId = upiId; }

    @Override
    public void pay(double amount) {
        System.out.println("Transferred $" + amount + " instantly via UPI VPA: " + upiId);
    }
    public String getName() { return "UPI FastPay"; }
}

// 3. Context
public class ShoppingCart {
    private PaymentStrategy strategy;

    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void checkout(double totalAmount) {
        if (strategy == null) throw new IllegalStateException("Payment strategy not selected!");
        strategy.pay(totalAmount);
    }
}`,
      typescript: `interface PaymentStrategy {
  pay(amount: number): string;
  name: string;
}

class CreditCardStrategy implements PaymentStrategy {
  name = "Credit Card (2% fee)";
  constructor(private card: string) {}
  pay(amount: number) {
    const fee = amount * 0.02;
    return \`Paid $\${(amount + fee).toFixed(2)} ($2% fee) with Card ending in \${this.card.slice(-4)}\`;
  }
}

class UpiStrategy implements PaymentStrategy {
  name = "UPI (Zero fee)";
  constructor(private upiId: string) {}
  pay(amount: number) {
    return \`Paid $\${amount.toFixed(2)} with 0% fee via UPI: \${this.upiId}\`;
  }
}

class ShoppingCart {
  private strategy?: PaymentStrategy;

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  checkout(amount: number): string {
    if (!this.strategy) throw new Error("No payment strategy selected");
    return this.strategy.pay(amount);
  }
}`,
      python: `class PaymentStrategy:
    def pay(self, amount: float) -> str: pass

class CreditCardStrategy(PaymentStrategy):
    def __init__(self, card_num: str): self.card_num = card_num
    def pay(self, amount: float):
        return f"Paid \${amount:.2f} with card ending {self.card_num[-4:]}"

class UpiStrategy(PaymentStrategy):
    def __init__(self, upi_id: str): self.upi_id = upi_id
    def pay(self, amount: float):
        return f"Paid \${amount:.2f} via UPI ID: {self.upi_id}"`
    },
    whenToUse: [
      "When you need to use different variants of an algorithm within an object and want to switch between them at runtime.",
      "When you have many related classes that differ only in the way they execute some behavior.",
      "To isolate the business logic of a class from the implementation details of algorithms."
    ],
    whenToAvoid: [
      "If you only have a couple of algorithms and they rarely change, introducing new interfaces and classes adds unnecessary complexity."
    ],
    tradeoffs: {
      pros: [
        "Swap algorithms used inside an object at runtime.",
        "Isolate implementation details of an algorithm from code that uses it.",
        "Open/Closed Principle: introduce new strategies without changing the context."
      ],
      cons: [
        "Clients must be aware of the differences between strategies to select the right one.",
        "Increases the number of classes in the project."
      ]
    },
    interviewTips: [
      "Show how Strategy eliminates messy `switch(type)` code and satisfies the Open/Closed Principle.",
      "Mention that modern Java and TypeScript can use Lambdas/Functional Interfaces as anonymous strategies."
    ]
  },
  {
    id: "observer-pattern",
    slug: "observer-pattern",
    name: "Observer Pattern (Pub/Sub)",
    category: "Behavioral",
    difficulty: "BEGINNER",
    readTimeMinutes: 8,
    oneLiner: "Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified automatically.",
    metaphor: "A newspaper subscription or YouTube channel. When the YouTuber uploads a new video, all subscribed viewers receive an instant notification on their phones.",
    realWorldUsage: [
      "UI Event Listeners (`button.addEventListener('click')`)",
      "Spring `@EventListener` / `ApplicationEventPublisher`",
      "Reactive streams (RxJava, Project Reactor `Flux`/`Mono`)",
      "Message brokers (Kafka topics, Redis Pub/Sub, RabbitMQ fanout exchanges)"
    ],
    intent: "Establish a loosely-coupled broadcast mechanism where a subject notifies observers of state changes.",
    problemSolved: "Polling. Observers periodically asking the subject 'Has your state changed yet?' wastes CPU and bandwidth.",
    solution: "The Subject maintains a list of Observers and provides `subscribe()` and `unsubscribe()` methods. When state changes, the Subject loops through and calls `observer.update(event)`.",
    interactiveType: "observer",
    structure: {
      participants: [
        { name: "Subject (Publisher)", role: "Maintains subscriber list and broadcasts events", type: "class" },
        { name: "Observer (Subscriber)", role: "Interface with update() method", type: "interface" },
        { name: "EmailNotifier, SlackBot", role: "Concrete subscribers reacting to updates", type: "class" }
      ],
      relationships: [
        "Subscribers register with subject.subscribe(observer)",
        "When event occurs, subject calls observer.update(data)"
      ]
    },
    code: {
      java: `// 1. Observer Interface
public interface OrderObserver {
    void onOrderEvent(String orderId, String eventType);
    String getChannelName();
}

// 2. Concrete Observers
public class EmailNotificationService implements OrderObserver {
    public void onOrderEvent(String orderId, String event) {
        System.out.println("[EMAIL] Dispatching email confirmation for order: " + orderId);
    }
    public String getChannelName() { return "Email"; }
}

public class SlackAlertService implements OrderObserver {
    public void onOrderEvent(String orderId, String event) {
        System.out.println("[SLACK #sales] New order event: " + event + " (ID: " + orderId + ")");
    }
    public String getChannelName() { return "Slack"; }
}

// 3. Subject (Publisher)
public class OrderManager {
    private final List<OrderObserver> listeners = new CopyOnWriteArrayList<>();

    public void subscribe(OrderObserver observer) {
        listeners.add(observer);
    }

    public void unsubscribe(OrderObserver observer) {
        listeners.remove(observer);
    }

    public void notify(String orderId, String eventType) {
        for (OrderObserver listener : listeners) {
            listener.onOrderEvent(orderId, eventType);
        }
    }
}`,
      typescript: `interface Observer {
  update(event: string, payload: any): string;
  name: string;
}

class EmailSubscriber implements Observer {
  name = "Email Gateway";
  update(event: string, payload: any) {
    return \`[EMAIL SENT] Notification for \${event}: \${JSON.stringify(payload)}\`;
  }
}

class SlackSubscriber implements Observer {
  name = "Slack Channel #ops";
  update(event: string, payload: any) {
    return \`[SLACK POSTED] Alert: \${event} triggered\`;
  }
}

class EventPublisher {
  private observers: Observer[] = [];

  subscribe(obs: Observer) { this.observers.push(obs); }
  unsubscribe(name: string) {
    this.observers = this.observers.filter(o => o.name !== name);
  }

  notify(event: string, payload: any): string[] {
    return this.observers.map(o => o.update(event, payload));
  }
}`,
      python: `class Observer:
    def update(self, event: str, data: dict): pass

class EmailService(Observer):
    def update(self, event: str, data: dict):
        print(f"[EMAIL] Sent for {event}: {data}")

class Publisher:
    def __init__(self):
        self._observers = []

    def subscribe(self, observer: Observer):
        self._observers.append(observer)

    def notify(self, event: str, data: dict):
        for obs in self._observers:
            obs.update(event, data)`
    },
    whenToUse: [
      "When changes to the state of one object may require changing other objects, and the set of objects is not known beforehand.",
      "When some objects in your app must observe others, but only for a limited time or in specific cases."
    ],
    whenToAvoid: [
      "When the notification chain can trigger circular dependency loops.",
      "When order of notifications matters critically (publishers do not guarantee subscriber order)."
    ],
    tradeoffs: {
      pros: [
        "Open/Closed: add new subscribers without modifying the publisher's code.",
        "Establishes dynamic, runtime relationships between components."
      ],
      cons: [
        "Subscribers are notified in random order.",
        "Memory leaks if subscribers are not explicitly unsubscribed (Lapsed Listener problem)."
      ]
    },
    interviewTips: [
      "Mention the 'Lapsed Listener' memory leak: how garbage collection cannot reclaim observers if the subject holds a strong reference to them.",
      "Explain how Observer is the architectural foundation of Reactive Programming (Rx, WebSockets, Kafka)."
    ]
  },
  {
    id: "command-pattern",
    slug: "command-pattern",
    name: "Command Pattern",
    category: "Behavioral",
    difficulty: "INTERMEDIATE",
    readTimeMinutes: 7,
    oneLiner: "Encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.",
    metaphor: "A waiter in a restaurant taking your order on a slip of paper. The slip encapsulates your order request. It can be queued, passed to the chef, tracked, or cancelled before cooking.",
    realWorldUsage: [
      "GUI action buttons & keyboard shortcuts (Copy, Paste, Undo)",
      "Transactional job queues (scheduling background tasks for later execution)",
      "CQRS (Command Query Responsibility Segregation) command handlers",
      "Redux actions (`dispatch({ type: 'ADD_TODO', payload: ... })`)"
    ],
    intent: "Encapsulate all details of an action into a standalone command object.",
    problemSolved: "Hardcoding business logic directly inside GUI buttons or API handlers, preventing undo/redo operations or deferred job queue execution.",
    solution: "Define a Command interface with `execute()` and `undo()` methods. Concrete commands encapsulate the receiver and parameters.",
    interactiveType: "chain",
    structure: {
      participants: [
        { name: "Command (Interface)", role: "Declares execute() and undo()", type: "interface" },
        { name: "ConcreteCommand", role: "Binds receiver to action", type: "class" },
        { name: "Receiver", role: "Knows how to perform the actual work (e.g. Light, Database)", type: "class" },
        { name: "Invoker", role: "Triggers command execution and tracks history", type: "class" }
      ],
      relationships: [
        "Invoker stores command in undo stack",
        "Invoker calls command.execute() -> Command calls receiver.action()"
      ]
    },
    code: {
      java: `// 1. Command Interface
public interface Command {
    void execute();
    void undo();
}

// 2. Receiver
public class TextDocument {
    private String text = "";
    public void append(String str) { text += str; }
    public void delete(int length) { text = text.substring(0, text.length() - length); }
    public String getText() { return text; }
}

// 3. Concrete Command
public class InsertTextCommand implements Command {
    private final TextDocument doc;
    private final String textToInsert;

    public InsertTextCommand(TextDocument doc, String textToInsert) {
        this.doc = doc;
        this.textToInsert = textToInsert;
    }

    public void execute() { doc.append(textToInsert); }
    public void undo() { doc.delete(textToInsert.length()); }
}

// 4. Invoker with Undo Stack
public class TextEditorInvoker {
    private final Deque<Command> history = new ArrayDeque<>();

    public void executeCommand(Command cmd) {
        cmd.execute();
        history.push(cmd);
    }

    public void undo() {
        if (!history.isEmpty()) {
            Command lastCmd = history.pop();
            lastCmd.undo();
        }
    }
}`,
      typescript: `interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  isOn = false;
  turnOn() { this.isOn = true; }
  turnOff() { this.isOn = false; }
}

class ToggleLightCommand implements Command {
  constructor(private light: Light) {}
  execute() { this.light.turnOn(); }
  undo() { this.light.turnOff(); }
}

class RemoteController {
  private history: Command[] = [];

  pressButton(cmd: Command) {
    cmd.execute();
    this.history.push(cmd);
  }

  pressUndo() {
    const cmd = this.history.pop();
    if (cmd) cmd.undo();
  }
}`,
      python: `class Command:
    def execute(self): pass
    def undo(self): pass

class Light:
    def on(self): print("Light turned ON")
    def off(self): print("Light turned OFF")

class LightOnCommand(Command):
    def __init__(self, light: Light): self.light = light
    def execute(self): self.light.on()
    def undo(self): self.light.off()`
    },
    whenToUse: [
      "When you want to parameterize objects with operations (callbacks).",
      "When you need to queue operations, schedule their execution, or execute them over a network.",
      "When you need to support reversible operations (Undo / Redo)."
    ],
    whenToAvoid: [
      "When actions are synchronous and immediate with no need for queuing, undo, or history tracking."
    ],
    tradeoffs: {
      pros: [
        "Single Responsibility: decouples the class that invokes the operation from the class that performs it.",
        "Open/Closed: introduce new commands without breaking existing code.",
        "Implement undo/redo and transactional rollbacks easily."
      ],
      cons: [
        "Code may become more complicated since you introduce a whole new layer of command classes."
      ]
    },
    interviewTips: [
      "Explain how Command Pattern is the foundation of Event Sourcing and Sagas in distributed systems.",
      "Show how an Invoker can maintain a Stack for undo and a Queue for asynchronous background workers."
    ]
  },
  {
    id: "chain-of-responsibility",
    slug: "chain-of-responsibility",
    name: "Chain of Responsibility",
    category: "Behavioral",
    difficulty: "INTERMEDIATE",
    readTimeMinutes: 7,
    oneLiner: "Passes requests along a chain of handlers. Upon receiving a request, each handler decides either to process it or to pass it to the next handler in the chain.",
    metaphor: "A customer support phone tree. The first automated agent handles FAQs. If unhandled, it transfers to Tier-1 support. If unresolved, it escalates to Tier-2 engineering.",
    realWorldUsage: [
      "Servlet Filter chains in Java (`javax.servlet.FilterChain`)",
      "Express.js middleware pipeline (`app.use(auth).use(rateLimit).use(handler)`)",
      "Spring Security filters (JWT validation -> CSRF check -> Role authorization)",
      "Expense approval workflows (Manager <= $1k, Director <= $10k, CEO <= $100k)"
    ],
    intent: "Decouple the sender of a request from its receivers by giving more than one object a chance to handle the request.",
    problemSolved: "Hardcoding a sequence of checks (authentication, rate limiting, logging, caching) into a monolithic function that is difficult to reorder or extend.",
    solution: "Chain handlers together. Each handler has a reference to `next`. A handler executes its logic and calls `next.handle(request)`.",
    interactiveType: "chain",
    structure: {
      participants: [
        { name: "Handler (Interface / Abstract)", role: "Declares handle() and setNext()", type: "interface" },
        { name: "AuthHandler, RateLimitHandler", role: "Concrete handlers performing checks", type: "class" },
        { name: "Client", role: "Assembles chain and passes request", type: "client" }
      ],
      relationships: [
        "Chain: AuthHandler -> RateLimitHandler -> CacheHandler -> Controller",
        "If any handler fails, it aborts the chain early"
      ]
    },
    code: {
      java: `public abstract class Middleware {
    private Middleware next;

    public Middleware linkWith(Middleware next) {
        this.next = next;
        return next;
    }

    public abstract boolean check(String user, String role);

    protected boolean checkNext(String user, String role) {
        if (next == null) return true;
        return next.check(user, role);
    }
}

// Concrete Handlers
public class RateLimitMiddleware extends Middleware {
    public boolean check(String user, String role) {
        System.out.println("Checking rate limit for: " + user);
        // If rate limit breached, abort chain early!
        return checkNext(user, role);
    }
}

public class RoleAuthMiddleware extends Middleware {
    public boolean check(String user, String role) {
        System.out.println("Verifying admin privileges for role: " + role);
        if (!"ADMIN".equals(role)) {
            System.out.println("403 Forbidden: Insufficient permissions");
            return false;
        }
        return checkNext(user, role);
    }
}

// Chain Assembly:
// Middleware chain = new RateLimitMiddleware();
// chain.linkWith(new RoleAuthMiddleware());
// chain.check("john_doe", "USER");`,
      typescript: `abstract class Middleware {
  private next?: Middleware;

  setNext(next: Middleware): Middleware {
    this.next = next;
    return next;
  }

  handle(req: { user: string; role: string; ip: string }): boolean {
    if (!this.check(req)) return false;
    if (this.next) return this.next.handle(req);
    return true;
  }

  abstract check(req: any): boolean;
}

class AuthCheck extends Middleware {
  check(req: any) {
    if (!req.user) { console.log("401 Unauthorized"); return false; }
    return true;
  }
}

class RateLimitCheck extends Middleware {
  check(req: any) {
    console.log("Rate limit OK for IP: " + req.ip);
    return true;
  }
}`,
      python: `class Handler:
    def __init__(self, next_handler=None):
        self.next = next_handler

    def handle(self, request):
        if self.next:
            return self.next.handle(request)
        return True`
    },
    whenToUse: [
      "When your program is expected to process different kinds of requests in various ways, but the exact types of requests and their sequences are unknown beforehand.",
      "When it is essential to execute several handlers in a specific order.",
      "When the set of handlers and their order are supposed to change at runtime."
    ],
    whenToAvoid: [
      "When requests must always be handled by one specific class and no chaining logic exists."
    ],
    tradeoffs: {
      pros: [
        "Control the order of request handling.",
        "Single Responsibility: decouple classes that invoke operations from classes that perform them.",
        "Open/Closed: introduce new handlers without breaking existing chains."
      ],
      cons: [
        "A request can drop off the end of the chain unhandled if no handler catches it."
      ]
    },
    interviewTips: [
      "Every modern web framework's middleware pipeline (Express, Spring, ASP.NET) is an implementation of Chain of Responsibility.",
      "Show how returning `false` or throwing an exception halts the chain immediately (fail-fast)."
    ]
  },
  {
    id: "state-pattern",
    slug: "state-pattern",
    name: "State Pattern",
    category: "Behavioral",
    difficulty: "INTERMEDIATE",
    readTimeMinutes: 8,
    oneLiner: "Allows an object to alter its behavior when its internal state changes. The object will appear to change its class.",
    metaphor: "A smartphone. Pressing the power button behaves differently depending on current state: if phone is Locked -> Screen wakes up. If phone is Unlocked -> Screen turns off. If phone is Ringing -> Silences ringer.",
    realWorldUsage: [
      "Order lifecycles (Created -> Paid -> Shipped -> Delivered -> Cancelled)",
      "TCP Connection state machine (LISTEN, SYN_SENT, ESTABLISHED, FIN_WAIT)",
      "Media player playback states (Playing, Paused, Stopped)",
      "Vending machine coin insertion and item dispensing"
    ],
    intent: "Encapsulate state-dependent behavior and make state transitions explicit without monster switch statements.",
    problemSolved: "Gigantic methods filled with conditional operators (`if (state == DRAFT) ... else if (state == REVIEW) ...`) that become nightmare bugs when a new state is added.",
    solution: "Create separate state classes for each possible state that implement a common State interface. The Context object delegates actions to the current State object.",
    interactiveType: "state",
    structure: {
      participants: [
        { name: "State (Interface)", role: "Declares actions like publish(), edit()", type: "interface" },
        { name: "Draft, Review, Published", role: "Concrete states handling actions and transitioning context", type: "class" },
        { name: "Document (Context)", role: "Maintains reference to current state", type: "class" }
      ],
      relationships: [
        "Context delegates document.publish() to currentState.publish(document)",
        "State transitions context: document.setState(new PublishedState())"
      ]
    },
    code: {
      java: `public interface DocumentState {
    void edit(Document doc, String text);
    void submitForReview(Document doc);
    void publish(Document doc);
    String getStatus();
}

public class DraftState implements DocumentState {
    public void edit(Document doc, String text) {
        doc.setContent(text);
        System.out.println("Draft updated.");
    }
    public void submitForReview(Document doc) {
        doc.setState(new ModerationState());
        System.out.println("Document moved to Moderation.");
    }
    public void publish(Document doc) {
        System.out.println("Error: Cannot publish a draft directly without review!");
    }
    public String getStatus() { return "DRAFT"; }
}

public class PublishedState implements DocumentState {
    public void edit(Document doc, String text) {
        System.out.println("Error: Cannot edit an immutable published document!");
    }
    public void submitForReview(Document doc) {
        System.out.println("Already approved and published.");
    }
    public void publish(Document doc) {
        System.out.println("Already published live.");
    }
    public String getStatus() { return "PUBLISHED"; }
}

public class Document {
    private DocumentState state = new DraftState();
    private String content = "";

    public void setState(DocumentState state) { this.state = state; }
    public void setContent(String content) { this.content = content; }
    
    public void edit(String text) { state.edit(this, text); }
    public void submit() { state.submitForReview(this); }
    public void publish() { state.publish(this); }
    public String getStatus() { return state.getStatus(); }
}`,
      typescript: `interface State {
  publish(): string;
  edit(text: string): string;
  name: string;
}

class DraftState implements State {
  name = "Draft";
  constructor(private doc: DocumentContext) {}

  edit(text: string) {
    this.doc.content = text;
    return \`Content updated: "\${text}"\`;
  }

  publish() {
    this.doc.setState(new PublishedState(this.doc));
    return "Draft approved and transitioned to PUBLISHED state!";
  }
}

class PublishedState implements State {
  name = "Published (Locked)";
  constructor(private doc: DocumentContext) {}

  edit() { return "ERROR: Cannot edit a published document directly"; }
  publish() { return "Document is already live"; }
}

export class DocumentContext {
  content = "";
  state: State = new DraftState(this);

  setState(state: State) { this.state = state; }
  edit(text: string) { return this.state.edit(text); }
  publish() { return this.state.publish(); }
}`,
      python: `class State:
    def publish(self, doc): pass
    def edit(self, doc, text): pass

class DraftState(State):
    def edit(self, doc, text):
        doc.content = text
        return "Updated draft"
    def publish(self, doc):
        doc.state = PublishedState()
        return "Published!"

class PublishedState(State):
    def edit(self, doc, text):
        return "Error: Cannot edit published document"`
    },
    whenToUse: [
      "When you have an object that behaves differently depending on its current state, the number of states is enormous, and state-specific code changes frequently.",
      "When you have a class polluted with massive conditionals that duplicate state transitions across methods."
    ],
    whenToAvoid: [
      "When a state machine is trivial (e.g. only 2 states like on/off) and unlikely to change."
    ],
    tradeoffs: {
      pros: [
        "Single Responsibility: organize code related to particular states into separate classes.",
        "Open/Closed: introduce new states without changing existing state classes or context.",
        "Eliminates bulky state-machine conditional statements."
      ],
      cons: [
        "Applying State Pattern can be overkill if a state machine has only a couple of states."
      ]
    },
    interviewTips: [
      "Compare State Pattern vs Strategy Pattern: they have identical UML class diagrams, but Strategy represents interchangeable algorithms, while State represents internal state transitions where states often know about each other.",
      "Discuss how State Pattern models real-world e-commerce inventory and order fulfillments."
    ]
  },
  {
    id: "template-method",
    slug: "template-method",
    name: "Template Method",
    category: "Behavioral",
    difficulty: "BEGINNER",
    readTimeMinutes: 6,
    oneLiner: "Defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure.",
    metaphor: "Building a prefabricated house. The master architectural blueprint defines the sequence: 1. Lay Foundation -> 2. Build Walls -> 3. Add Roof. Subclasses choose whether walls are wooden, brick, or glass.",
    realWorldUsage: [
      "Spring `JdbcTemplate` / `RestTemplate`",
      "Java `AbstractList` / `HttpServlet.service()` calling `doGet()`, `doPost()`",
      "Data mining & report generators (Extract -> Transform -> Load)",
      "Game loop updates (processInput -> updatePhysics -> render)"
    ],
    intent: "Define an algorithm's invariant framework in a base class, allowing subclasses to customize specific steps.",
    problemSolved: "Code duplication across subclasses that perform nearly identical algorithms with only minor step differences.",
    solution: "Declare a `final` template method in the abstract base class that calls a series of abstract or hook methods implemented by subclasses.",
    interactiveType: "chain",
    structure: {
      participants: [
        { name: "AbstractClass", role: "Defines templateMethod() and abstract primitive steps", type: "class" },
        { name: "ConcreteClassA / B", role: "Overrides primitive steps to customize behavior", type: "class" }
      ],
      relationships: [
        "Template method is final: cannot be overridden",
        "Subclasses supply custom step implementations"
      ]
    },
    code: {
      java: `public abstract class DataMiner {
    // The Template Method (final prevents overriding the sequence!)
    public final void mineData(String path) {
        openFile(path);
        extractData();
        parseData();
        hookAfterParse(); // Optional hook
        closeFile();
    }

    protected abstract void openFile(String path);
    protected abstract void extractData();
    protected abstract void parseData();

    // Default Hook Method
    protected void hookAfterParse() {}

    private void closeFile() {
        System.out.println("File stream safely closed.");
    }
}

public class PdfDataMiner extends DataMiner {
    protected void openFile(String path) { System.out.println("Opening PDF byte stream: " + path); }
    protected void extractData() { System.out.println("Extracting PDF text layers and vector glyphs"); }
    protected void parseData() { System.out.println("Parsing extracted PDF text into schema"); }
}

public class CsvDataMiner extends DataMiner {
    protected void openFile(String path) { System.out.println("Opening CSV text reader: " + path); }
    protected void extractData() { System.out.println("Reading comma-separated rows"); }
    protected void parseData() { System.out.println("Parsing columns into DTO objects"); }
}`,
      typescript: `abstract class DataMiner {
  // Template Method
  mine(path: string): string[] {
    const logs = [];
    logs.push(this.openFile(path));
    logs.push(this.extract());
    logs.push(this.parse());
    logs.push("File closed safely.");
    return logs;
  }

  protected abstract openFile(path: string): string;
  protected abstract extract(): string;
  protected abstract parse(): string;
}

class PdfMiner extends DataMiner {
  protected openFile(path: string) { return \`Opened PDF: \${path}\`; }
  protected extract() { return "Extracted raw PDF stream"; }
  protected parse() { return "Parsed PDF text blocks"; }
}`,
      python: `class DataMiner:
    def mine(self, path: str):
        self.open_file(path)
        self.extract()
        self.parse()
        print("Closed file")

    def open_file(self, path): raise NotImplementedError
    def extract(self): raise NotImplementedError
    def parse(self): raise NotImplementedError`
    },
    whenToUse: [
      "When you want to let clients extend only particular steps of an algorithm, but not the whole algorithm or its structure.",
      "When you have several classes that contain almost identical algorithms with some minor differences."
    ],
    whenToAvoid: [
      "When the algorithm skeleton itself needs to vary significantly across implementations."
    ],
    tradeoffs: {
      pros: [
        "Let clients override only certain parts of a large algorithm, making them less affected by changes in other parts.",
        "Pull the duplicate code into a superclass."
      ],
      cons: [
        "Template methods tend to be harder to maintain the more steps they have."
      ]
    },
    interviewTips: [
      "Explain the 'Hollywood Principle': 'Don't call us, we'll call you' (the superclass calls subclass methods, not vice versa).",
      "Mention Spring's `JdbcTemplate` as a classic enterprise template pattern."
    ]
  },
  {
    id: "prototype-pattern",
    slug: "prototype-pattern",
    name: "Prototype Pattern",
    category: "Creational",
    difficulty: "INTERMEDIATE",
    readTimeMinutes: 6,
    oneLiner: "Specifies the kinds of objects to create using a prototypical instance, and creates new objects by copying this prototype.",
    metaphor: "Cell division (mitosis). A biological cell duplicates its DNA and splits into an identical copy, without having to rebuild the cell from raw atoms from scratch.",
    realWorldUsage: [
      "java.lang.Cloneable / Object.clone()",
      "Game development spawning (copying monster templates with preloaded 3D meshes)",
      "Document templates (invoice or contract drafts created from a pre-filled base template)"
    ],
    intent: "Copy existing objects without making your code dependent on their concrete classes.",
    problemSolved: "Directly instantiating and copying complex objects whose private fields cannot be accessed from outside, or when object initialization involves expensive database queries or file loading.",
    solution: "Declare a Cloneable / Prototype interface with a clone() method. The object itself copies its own private fields into a new instance.",
    interactiveType: "factory",
    structure: {
      participants: [
        { name: "Prototype (Interface)", role: "Declares clone()", type: "interface" },
        { name: "ConcretePrototype", role: "Implements deep/shallow copy of fields", type: "class" },
        { name: "PrototypeRegistry", role: "Stores pre-warmed prototypes by key", type: "class" }
      ],
      relationships: [
        "Client requests registry.get('warrior').clone()",
        "Clone method returns an independent copy ready for customization"
      ]
    },
    code: {
      java: `public interface Prototype<T> {
    T cloneObject();
}

public class GameNPC implements Prototype<GameNPC> {
    private String model3D; // Expensive 50MB 3D mesh
    private int health;
    private List<String> inventory;

    public GameNPC(String model3D, int health, List<String> inventory) {
        this.model3D = model3D;
        this.health = health;
        this.inventory = new ArrayList<>(inventory);
    }

    @Override
    public GameNPC cloneObject() {
        // Deep copy of mutable collections
        return new GameNPC(this.model3D, this.health, new ArrayList<>(this.inventory));
    }
}`,
      typescript: `interface Prototype<T> {
  clone(): T;
}

class GameMonster implements Prototype<GameMonster> {
  constructor(
    public name: string,
    public health: number,
    public abilities: string[]
  ) {}

  clone(): GameMonster {
    return new GameMonster(this.name, this.health, [...this.abilities]);
  }
}`,
      python: `import copy

class GameMonster:
    def __init__(self, name: str, health: int, skills: list):
        self.name = name
        self.health = health
        self.skills = skills

    def clone(self):
        return copy.deepcopy(self)`
    },
    whenToUse: [
      "When your code shouldn't depend on the concrete classes of objects that you need to copy.",
      "When you want to reduce the number of subclasses that only differ in the way they initialize their respective objects."
    ],
    whenToAvoid: [
      "When cloning complex objects that have circular references (can lead to infinite recursion during deep copy)."
    ],
    tradeoffs: {
      pros: ["Clone objects without coupling to concrete classes.", "Avoid expensive repeat initialization."],
      cons: ["Cloning complex objects with circular references is tricky."]
    },
    interviewTips: [
      "Explain the critical difference between Shallow Copy (references shared) vs Deep Copy (nested objects cloned)."
    ]
  },
  {
    id: "composite-pattern",
    slug: "composite-pattern",
    name: "Composite Pattern",
    category: "Structural",
    difficulty: "INTERMEDIATE",
    readTimeMinutes: 7,
    oneLiner: "Composes objects into tree structures to represent part-whole hierarchies, letting clients treat individual objects and compositions uniformly.",
    metaphor: "A computer file system. A Folder can contain Files AND other Folders. Calling `getSize()` on a Folder computes the total size recursively, treating leaf files and container folders uniformly.",
    realWorldUsage: [
      "DOM element trees (HTML body, div, span, text node)",
      "GUI component trees (Panel containing Buttons, TextBoxes, and sub-Panels)",
      "Organization employee hierarchy (Manager supervising Engineers and other Managers)",
      "Compound graphic shapes in drawing tools"
    ],
    intent: "Treat individual objects and compositions of objects identically.",
    problemSolved: "Having to write separate recursive loops and type checks (`if (item instanceof Folder) ... else ...`) to calculate totals across nested trees.",
    solution: "Define a common Component interface with shared operations. Both Leaf (file) and Composite (folder) implement the interface.",
    interactiveType: "chain",
    structure: {
      participants: [
        { name: "FileSystemComponent (Interface)", role: "Common operation: getSize()", type: "interface" },
        { name: "File (Leaf)", role: "Returns file byte size directly", type: "class" },
        { name: "Directory (Composite)", role: "Contains children and sums their getSize()", type: "class" }
      ],
      relationships: [
        "Directory contains a List<FileSystemComponent>",
        "Client calls root.getSize() without caring about tree depth"
      ]
    },
    code: {
      java: `public interface FileSystemItem {
    long getSize();
    String getName();
}

public class FileItem implements FileSystemItem {
    private final String name;
    private final long sizeBytes;

    public FileItem(String name, long sizeBytes) {
        this.name = name;
        this.sizeBytes = sizeBytes;
    }
    public long getSize() { return sizeBytes; }
    public String getName() { return name; }
}

public class DirectoryItem implements FileSystemItem {
    private final String name;
    private final List<FileSystemItem> children = new ArrayList<>();

    public DirectoryItem(String name) { this.name = name; }
    public void add(FileSystemItem item) { children.add(item); }

    public long getSize() {
        return children.stream().mapToLong(FileSystemItem::getSize).sum();
    }
    public String getName() { return name; }
}`,
      typescript: `interface FileItem {
  getSize(): number;
  name: string;
}

class SingleFile implements FileItem {
  constructor(public name: string, private bytes: number) {}
  getSize() { return this.bytes; }
}

class Folder implements FileItem {
  private items: FileItem[] = [];
  constructor(public name: string) {}
  add(item: FileItem) { this.items.push(item); }
  getSize() {
    return this.items.reduce((sum, item) => sum + item.getSize(), 0);
  }
}`,
      python: `class FileItem:
    def get_size(self) -> int: pass

class File(FileItem):
    def __init__(self, name: str, size: int):
        self.name = name
        self.size = size
    def get_size(self): return self.size

class Folder(FileItem):
    def __init__(self, name: str):
        self.name = name
        self.children = []
    def add(self, item: FileItem): self.children.append(item)
    def get_size(self):
        return sum(child.get_size() for child in self.children)`
    },
    whenToUse: [
      "When you have to implement a tree-like object structure.",
      "When you want the client code to treat both simple and complex elements uniformly."
    ],
    whenToAvoid: [
      "When the tree elements share too few common operations, forcing awkward empty method implementations."
    ],
    tradeoffs: {
      pros: ["Polymorphism and recursion make working with complex trees effortless.", "Open/Closed Principle."],
      cons: ["Hard to provide a common interface for classes whose functionality differs too much."]
    },
    interviewTips: [
      "Mention file systems, org charts, and DOM trees as the top 3 textbook examples of Composite."
    ]
  },
  {
    id: "flyweight-pattern",
    slug: "flyweight-pattern",
    name: "Flyweight Pattern",
    category: "Structural",
    difficulty: "ADVANCED",
    readTimeMinutes: 7,
    oneLiner: "Fits more objects into the available amount of RAM by sharing common parts of state between multiple objects instead of keeping all of the data in each object.",
    metaphor: "Rendering 1,000,000 trees in a video game forest. Rather than loading the 3D mesh and texture 1,000,000 times, you share 1 TreeType in RAM and only store unique (X, Y) coordinates for each tree.",
    realWorldUsage: [
      "java.lang.Integer.valueOf(int) caching (-128 to 127)",
      "String interning (`String.intern()`)",
      "Text editors rendering characters (sharing Font and Glyph textures)",
      "Game particle systems (bullets, smoke, rain drops)"
    ],
    intent: "Minimize memory consumption by sharing identical intrinsic data across millions of objects.",
    problemSolved: "Running out of RAM (Out of Memory) when instantiating millions of small objects that duplicate heavy immutable data.",
    solution: "Separate Intrinsic State (shared, constant, read-only) from Extrinsic State (unique, contextual, passed via method arguments).",
    interactiveType: "factory",
    structure: {
      participants: [
        { name: "TreeType (Flyweight)", role: "Shared intrinsic state (name, color, 3D texture)", type: "class" },
        { name: "Tree (Context)", role: "Extrinsic state (X, Y coordinates + reference to TreeType)", type: "class" },
        { name: "TreeFactory", role: "Caches and returns existing TreeType instances", type: "class" }
      ],
      relationships: [
        "1,000,000 Trees share only 3 TreeType instances in memory",
        "RAM usage drops from 2GB to 15MB"
      ]
    },
    code: {
      java: `// Intrinsic State (Shared in RAM)
public class TreeType {
    private final String name;
    private final String color;
    private final byte[] texture3D; // 10MB texture

    public TreeType(String name, String color, byte[] texture3D) {
        this.name = name;
        this.color = color;
        this.texture3D = texture3D;
    }

    public void draw(int x, int y) {
        System.out.println("Drawing " + name + " at coords (" + x + ", " + y + ")");
    }
}

// Flyweight Factory (Cache)
public class TreeFactory {
    private static final Map<String, TreeType> cache = new HashMap<>();

    public static TreeType getTreeType(String name, String color) {
        String key = name + "_" + color;
        return cache.computeIfAbsent(key, k -> new TreeType(name, color, new byte[1024]));
    }
}

// Extrinsic State (Context)
public class Tree {
    private final int x;
    private final int y;
    private final TreeType type; // Shared reference

    public Tree(int x, int y, TreeType type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    public void draw() { type.draw(x, y); }
}`,
      typescript: `class TreeType {
  constructor(public name: string, public color: string, public texture: string) {}
  draw(x: number, y: number) {
    return \`Drawing \${this.name} at (\${x}, \${y})\`;
  }
}

class TreeFactory {
  private static types = new Map<string, TreeType>();

  static get(name: string, color: string): TreeType {
    const key = \`\${name}_\${color}\`;
    if (!this.types.has(key)) {
      this.types.set(key, new TreeType(name, color, "SharedTextureBuffer"));
    }
    return this.types.get(key)!;
  }
}`,
      python: `class TreeType:
    def __init__(self, name: str, color: str):
        self.name = name
        self.color = color

class TreeFactory:
    _types = {}
    @classmethod
    def get(cls, name: str, color: str):
        key = (name, color)
        if key not in cls._types:
            cls._types[key] = TreeType(name, color)
        return cls._types[key]`
    },
    whenToUse: [
      "Only when your program must spawn a huge number of similar objects that exhaust available RAM."
    ],
    whenToAvoid: [
      "When memory is not a bottleneck (Flyweight introduces code complexity and minor CPU overhead)."
    ],
    tradeoffs: {
      pros: ["Saves massive amounts of RAM when dealing with millions of objects."],
      cons: ["Trades RAM for minor CPU cycles calculating extrinsic state.", "Complicates object model."]
    },
    interviewTips: [
      "Mention `Integer.valueOf(100) == Integer.valueOf(100)` returning `true` because of the JVM Integer cache flyweight (-128 to 127)."
    ]
  },
  {
    id: "iterator-pattern",
    slug: "iterator-pattern",
    name: "Iterator Pattern",
    category: "Behavioral",
    difficulty: "BEGINNER",
    readTimeMinutes: 6,
    oneLiner: "Lets you traverse elements of a collection without exposing its underlying representation (list, stack, tree, graph).",
    metaphor: "A tour guide in a museum. The guide walks you through exhibits in a curated sequence (chronological, theme-based) without you needing to know the museum's private floorplan.",
    realWorldUsage: [
      "java.util.Iterator (`hasNext()`, `next()`)",
      "JavaScript Symbol.iterator (`for ... of` loops)",
      "Database cursors (`ResultSet.next()`)",
      "Tree depth-first vs breadth-first traversal iterators"
    ],
    intent: "Provide a standard way to access elements of an aggregate object sequentially without exposing internal structures.",
    problemSolved: "Exposing internal storage (e.g. array vs linked list vs binary tree) to clients who just want to loop through items.",
    solution: "Extract traversal into a dedicated Iterator object with `hasNext()` and `next()` methods.",
    interactiveType: "chain",
    structure: {
      participants: [
        { name: "Iterator (Interface)", role: "Declares hasNext() and next()", type: "interface" },
        { name: "IterableCollection", role: "Declares createIterator()", type: "interface" },
        { name: "ConcreteIterator", role: "Tracks current position and traverses collection", type: "class" }
      ],
      relationships: [
        "Collection instantiates matching iterator",
        "Client traverses collection through Iterator interface"
      ]
    },
    code: {
      java: `public interface SimpleIterator<T> {
    boolean hasNext();
    T next();
}

public class NameRepository {
    public String[] names = {"Alice", "Bob", "Charlie", "Diana"};

    public SimpleIterator<String> getIterator() {
        return new NameIterator();
    }

    private class NameIterator implements SimpleIterator<String> {
        int index = 0;
        public boolean hasNext() { return index < names.length; }
        public String next() {
            if (this.hasNext()) return names[index++];
            return null;
        }
    }
}`,
      typescript: `class CustomCollection {
  constructor(private items: string[]) {}

  // JavaScript native Symbol.iterator
  *[Symbol.iterator]() {
    for (const item of this.items) {
      yield item;
    }
  }
}`,
      python: `class Countdown:
    def __init__(self, start: int):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1`
    },
    whenToUse: [
      "When your collection has a complex data structure under the hood, but you want to hide its complexity from clients.",
      "To reduce duplication of the traversal code across your app.",
      "When you want your code to be able to traverse different data structures using the same interface."
    ],
    whenToAvoid: [
      "When working with simple lists where native language loops (`for`, `forEach`) are sufficient."
    ],
    tradeoffs: {
      pros: ["Single Responsibility: clean traversal code.", "Open/Closed: add new collection and traversal types seamlessly."],
      cons: ["Applying to simple collections can be over-engineering."]
    },
    interviewTips: [
      "Explain how Iterator decouples traversal algorithms from graph/tree data structures."
    ]
  },
  {
    id: "mediator-pattern",
    slug: "mediator-pattern",
    name: "Mediator Pattern",
    category: "Behavioral",
    difficulty: "INTERMEDIATE",
    readTimeMinutes: 7,
    oneLiner: "Restricts direct communications between objects and forces them to collaborate only via a mediator object.",
    metaphor: "An Air Traffic Control (ATC) tower. Airplanes do not talk directly to each other to negotiate runway landings; every pilot talks exclusively to the ATC tower, which coordinates safe spacing.",
    realWorldUsage: [
      "Chat room servers (Users send messages to ChatMediator, not to individual user sockets directly)",
      "UI dialogs (Checkbox toggling disabled state of Submit button and showing extra inputs via DialogMediator)",
      "MediatR in .NET / Spring ApplicationContext as in-process command/event mediator"
    ],
    intent: "Reduce chaotic dependencies between objects by making them communicate through a centralized mediator.",
    problemSolved: "Tightly-coupled 'spaghetti' architectures where every component holds direct references to 10 other components.",
    solution: "Extract all component-to-component interactions into a Mediator class.",
    interactiveType: "observer",
    structure: {
      participants: [
        { name: "Mediator (Interface)", role: "Declares notify(sender, event)", type: "interface" },
        { name: "ConcreteMediator (ATC Tower)", role: "Coordinates interactions between colleagues", type: "class" },
        { name: "Colleagues (Planes / UI Components)", role: "Communicate only with the Mediator", type: "class" }
      ],
      relationships: [
        "Colleagues only hold a reference to Mediator",
        "Mediator routes notifications to appropriate target colleagues"
      ]
    },
    code: {
      java: `public interface ChatMediator {
    void sendMessage(String msg, User sender);
    void registerUser(User user);
}

public class ChatRoomMediator implements ChatMediator {
    private final List<User> users = new ArrayList<>();

    public void registerUser(User user) { users.add(user); }

    public void sendMessage(String msg, User sender) {
        for (User u : users) {
            // Don't send the message back to the sender
            if (u != sender) {
                u.receive(msg, sender.getName());
            }
        }
    }
}`,
      typescript: `interface Mediator {
  notify(sender: object, event: string): void;
}

class DialogMediator implements Mediator {
  constructor(private checkbox: any, private button: any) {}

  notify(sender: object, event: string) {
    if (event === "CHECKBOX_TOGGLED") {
      this.button.setEnabled(this.checkbox.isChecked());
    }
  }
}`,
      python: `class ChatMediator:
    def __init__(self):
        self.users = []
    def add_user(self, user): self.users.append(user)
    def send(self, msg, sender):
        for u in self.users:
            if u != sender:
                u.receive(msg)`
    },
    whenToUse: [
      "When it is hard to change some of the classes because they are tightly coupled to a dozen other classes.",
      "When you cannot reuse a component in a different program because it's too dependent on other components."
    ],
    whenToAvoid: [
      "When interactions are simple and direct; a mediator can inadvertently evolve into an unmaintainable 'God Object'."
    ],
    tradeoffs: {
      pros: ["Single Responsibility: extract communications into one place.", "Decouples colleagues."],
      cons: ["Over time a mediator can evolve into a God Object with too much power."]
    },
    interviewTips: [
      "Contrast Mediator vs Observer: Mediator centralizes complex multi-way communication; Observer distributes one-to-many event notifications."
    ]
  },
  {
    id: "memento-pattern",
    slug: "memento-pattern",
    name: "Memento Pattern",
    category: "Behavioral",
    difficulty: "INTERMEDIATE",
    readTimeMinutes: 7,
    oneLiner: "Lets you save and restore the previous state of an object without revealing the details of its implementation.",
    metaphor: "A game save checkpoint or git commit. You take a snapshot of the current state and stash it. If you die or make a mistake, you can reload the exact snapshot without exposing private variables.",
    realWorldUsage: [
      "Text editor undo/redo history (Ctrl+Z)",
      "Database rollback transaction snapshots",
      "Game save states and checkpoints",
      "Calculator restore point"
    ],
    intent: "Capture an object's internal state so it can be restored later without violating encapsulation.",
    problemSolved: "Allowing an external History or Caretaker manager to save snapshots of an object without making its private fields public.",
    solution: "The Originator produces a Memento (an opaque snapshot). The Caretaker stores mementos in a stack and passes them back to the Originator to restore state.",
    interactiveType: "chain",
    structure: {
      participants: [
        { name: "Originator (Editor)", role: "Creates mementos and restores state from them", type: "class" },
        { name: "Memento (Snapshot)", role: "Immutable state container", type: "class" },
        { name: "Caretaker (History Stack)", role: "Stores list of mementos without inspecting contents", type: "class" }
      ],
      relationships: [
        "Originator.save() -> returns new Memento(state)",
        "Caretaker pushes to stack; on undo: Originator.restore(memento)"
      ]
    },
    code: {
      java: `// Memento (Immutable Snapshot)
public record EditorMemento(String text, int cursorPosition) {}

// Originator
public class TextEditor {
    private String text = "";
    private int cursor = 0;

    public void write(String words) {
        text += words;
        cursor = text.length();
    }

    public EditorMemento save() {
        return new EditorMemento(text, cursor);
    }

    public void restore(EditorMemento memento) {
        this.text = memento.text();
        this.cursor = memento.cursorPosition();
    }
}

// Caretaker
public class HistoryManager {
    private final Deque<EditorMemento> history = new ArrayDeque<>();

    public void push(EditorMemento memento) { history.push(memento); }
    public EditorMemento pop() { return history.pop(); }
}`,
      typescript: `class Memento {
  constructor(readonly state: string) {}
}

class Editor {
  private content = "";
  type(text: string) { this.content += text; }
  save(): Memento { return new Memento(this.content); }
  restore(m: Memento) { this.content = m.state; }
}`,
      python: `class Memento:
    def __init__(self, state):
        self.state = state

class Editor:
    def __init__(self):
        self.text = ""
    def save(self): return Memento(self.text)
    def restore(self, memento): self.text = memento.state`
    },
    whenToUse: [
      "When you want to produce snapshots of the object's state to be able to restore a previous state.",
      "When direct access to the object's fields/getters/setters violates its encapsulation."
    ],
    whenToAvoid: [
      "When snapshots consume vast amounts of memory (frequent snapshots of gigabyte datasets cause OOM)."
    ],
    tradeoffs: {
      pros: ["Produces snapshots without violating the object's encapsulation.", "Simplifies Originator."],
      cons: ["Can consume a lot of RAM if clients create mementos too often."]
    },
    interviewTips: [
      "Explain how Memento pairs with the Command pattern to implement Undo/Redo stacks."
    ]
  },
  {
    id: "visitor-pattern",
    slug: "visitor-pattern",
    name: "Visitor Pattern",
    category: "Behavioral",
    difficulty: "ADVANCED",
    readTimeMinutes: 8,
    oneLiner: "Lets you separate algorithms from the objects on which they operate by using Double Dispatch.",
    metaphor: "A tax auditor visiting different properties (Residential home, Commercial factory, Agricultural farm). Each property accepts the auditor (`property.accept(auditor)`), and the auditor executes property-specific tax calculations without changing the property's class.",
    realWorldUsage: [
      "Compilers and Abstract Syntax Trees (AST visitors for type-checking, code generation, linting)",
      "Document exporters (Exporting elements to PDF, HTML, or Markdown without modifying elements)",
      "Report generation over heterogeneous object graphs"
    ],
    intent: "Add new operations to existing class hierarchies without modifying the classes.",
    problemSolved: "Polluting domain model classes (e.g. `Circle`, `Rectangle`, `Dot`) with unrelated exporting, linting, or auditing code.",
    solution: "Define a Visitor interface with an `export(Circle)`, `export(Rectangle)` method for each element type. Elements implement `accept(Visitor)` and dispatch `visitor.export(this)` (Double Dispatch).",
    interactiveType: "chain",
    structure: {
      participants: [
        { name: "Visitor (Interface)", role: "Declares visit(ConcreteElementA), visit(ConcreteElementB)", type: "interface" },
        { name: "Element (Interface)", role: "Declares accept(Visitor)", type: "interface" },
        { name: "XmlExportVisitor, JsonExportVisitor", role: "Concrete operations over all elements", type: "class" }
      ],
      relationships: [
        "element.accept(visitor) -> executes visitor.visit(element)",
        "New operations are added by writing a new Visitor class without touching Elements"
      ]
    },
    code: {
      java: `public interface Shape {
    void accept(Visitor visitor);
}

public interface Visitor {
    void visitCircle(Circle circle);
    void visitRectangle(Rectangle rect);
}

public class Circle implements Shape {
    public int radius = 10;
    public void accept(Visitor visitor) { visitor.visitCircle(this); }
}

public class Rectangle implements Shape {
    public int width = 20, height = 30;
    public void accept(Visitor visitor) { visitor.visitRectangle(this); }
}

// Adding new export operation without modifying Circle or Rectangle!
public class SvgExportVisitor implements Visitor {
    public void visitCircle(Circle c) {
        System.out.println("<circle r='" + c.radius + "' />");
    }
    public void visitRectangle(Rectangle r) {
        System.out.println("<rect width='" + r.width + "' height='" + r.height + "' />");
    }
}`,
      typescript: `interface ShapeVisitor {
  visitCircle(c: Circle): string;
  visitSquare(s: Square): string;
}

interface Shape {
  accept(v: ShapeVisitor): string;
}

class Circle implements Shape {
  constructor(public radius: number) {}
  accept(v: ShapeVisitor) { return v.visitCircle(this); }
}

class Square implements Shape {
  constructor(public size: number) {}
  accept(v: ShapeVisitor) { return v.visitSquare(this); }
}`,
      python: `class Shape:
    def accept(self, visitor): pass

class Circle(Shape):
    def __init__(self, r): self.r = r
    def accept(self, v): return v.visit_circle(self)

class Square(Shape):
    def __init__(self, s): self.s = s
    def accept(self, v): return v.visit_square(self)`
    },
    whenToUse: [
      "When you need to perform an operation on all elements of a complex object structure (such as an AST tree).",
      "When an object structure rarely changes, but you frequently need to define new operations over it."
    ],
    whenToAvoid: [
      "When the element hierarchy changes frequently (adding a new Element requires updating every single Visitor interface and class)."
    ],
    tradeoffs: {
      pros: ["Open/Closed: add new operations easily.", "Single Responsibility: related operations grouped into a single visitor."],
      cons: ["Hard to add new element classes to the hierarchy."]
    },
    interviewTips: [
      "Explain 'Double Dispatch': the method that gets executed depends on both the type of the receiver AND the type of the argument."
    ]
  },
  {
    id: "circuit-breaker-pattern",
    slug: "circuit-breaker-pattern",
    name: "Circuit Breaker Pattern",
    category: "Concurrency",
    difficulty: "CRITICAL",
    readTimeMinutes: 8,
    oneLiner: "Detects failures and encapsulates the logic of preventing a failure from constantly recurring during maintenance, temporary external or system difficulties.",
    metaphor: "An electrical circuit breaker in your house. If a wire shorts out, the breaker trips to prevent electrical fires and damage to appliances.",
    realWorldUsage: [
      "Resilience4j / Netflix Hystrix in Spring Boot",
      "Envoy Proxy outlier detection and circuit breaking",
      "Polly in .NET / opossum in Node.js",
      "Microservice outbound network calls to SaaS and payment gateways"
    ],
    intent: "Prevent an application from repeatedly executing an operation that is doomed to fail.",
    problemSolved: "Cascading microservice failures: an unresponsive downstream API holds worker threads hostage until the entire calling service runs out of memory.",
    solution: "Track failure rates in a rolling window across 3 states: CLOSED (healthy), OPEN (fail-fast immediately), and HALF-OPEN (testing trial requests).",
    interactiveType: "chain",
    structure: {
      participants: [
        { name: "CircuitBreaker", role: "State machine tracking failure % and managing transitions", type: "class" },
        { name: "CLOSED State", role: "All requests pass through to external dependency", type: "class" },
        { name: "OPEN State", role: "Fail fast: return fallback or 503 without hitting dependency", type: "class" },
        { name: "HALF-OPEN State", role: "Allows limited trial requests to see if dependency healed", type: "class" }
      ],
      relationships: [
        "Failure rate > 50% -> trips CLOSED to OPEN",
        "Wait duration expires -> transitions OPEN to HALF-OPEN",
        "Trial calls succeed -> heals back to CLOSED"
      ]
    },
    code: {
      java: `// Resilience4j Circuit Breaker in Spring Boot
@Service
public class PaymentGatewayClient {

    private final RestClient restClient;

    @CircuitBreaker(name = "paymentService", fallbackMethod = "fallbackPayment")
    public PaymentResponse charge(PaymentRequest request) {
        return restClient.post()
            .uri("/v1/charge")
            .body(request)
            .retrieve()
            .body(PaymentResponse.class);
    }

    // Fail-fast fallback executed when circuit is OPEN
    public PaymentResponse fallbackPayment(PaymentRequest request, Throwable ex) {
        System.out.println("Circuit OPEN: Payment service degraded. Queueing request.");
        return PaymentResponse.degradedQueue(request.getId());
    }
}`,
      typescript: `enum CircuitState { CLOSED, OPEN, HALF_OPEN }

class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failures = 0;
  private lastFailureTime = 0;

  async execute(fn: () => Promise<any>): Promise<any> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > 15000) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error("CIRCUIT_OPEN: Fast fallback triggered");
      }
    }

    try {
      const res = await fn();
      if (this.state === CircuitState.HALF_OPEN) this.state = CircuitState.CLOSED;
      this.failures = 0;
      return res;
    } catch (e) {
      this.failures++;
      this.lastFailureTime = Date.now();
      if (this.failures >= 3) this.state = CircuitState.OPEN;
      throw e;
    }
  }
}`,
      python: `import time

class CircuitBreaker:
    def __init__(self, failure_threshold=3, recovery_time=15):
        self.state = "CLOSED"
        self.failures = 0
        self.last_failure = 0
        self.threshold = failure_threshold
        self.recovery = recovery_time

    def call(self, func, *args):
        if self.state == "OPEN":
            if time.time() - self.last_failure > self.recovery:
                self.state = "HALF-OPEN"
            else:
                raise Exception("Circuit OPEN: Fail-fast fallback")
        try:
            res = func(*args)
            self.state = "CLOSED"
            self.failures = 0
            return res
        except Exception as e:
            self.failures += 1
            self.last_failure = time.time()
            if self.failures >= self.threshold:
                self.state = "OPEN"
            raise e`
    },
    whenToUse: [
      "Every outbound network call to external APIs, remote microservices, or databases over a network.",
      "To prevent cascading thread starvation in high-throughput distributed systems."
    ],
    whenToAvoid: [
      "For local in-memory method calls within the same process."
    ],
    tradeoffs: {
      pros: ["Prevents cascading cluster outages.", "Protects recovering downstream systems from thundering herds."],
      cons: ["Tuning failure thresholds and timeouts requires production metrics testing."]
    },
    interviewTips: [
      "Draw the 3-state state machine: CLOSED -> OPEN -> HALF-OPEN -> CLOSED.",
      "Highlight how it saves thread pools from exhaustion during partner outages."
    ]
  }
];

export const PATTERN_CATEGORIES: PatternCategory[] = [
  "Creational",
  "Structural",
  "Behavioral",
  "Concurrency"
];
