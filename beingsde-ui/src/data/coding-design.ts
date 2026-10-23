export interface ScribbleStep {
  label: string;
  sublabel?: string;
  type?: "source" | "process" | "decision" | "success" | "failure" | "storage" | "queue";
  badge?: string;
}

export interface CodingDesignTopic {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: "Resilience & Retries" | "Data & State Consistency" | "API Contracts & Errors" | "Observability & Logging" | "Ops, Config & Security" | "Database & Performance";
  categoryColor: string; // e.g. "emerald", "blue", "purple", "amber", "rose", "cyan"
  difficulty: "ESSENTIAL" | "ADVANCED" | "CRITICAL";
  readTimeMinutes: number;
  tags: string[];
  
  // 3-Line Quick Best Practice Summary
  summary: {
    rule: string;
    whyItMatters: string;
    whenToUse: string;
    verdict: string;
  };

  keyTakeaways: string[];
  
  // Scribble diagram configuration
  scribble: {
    badge: string;
    caption: string;
    diagramType: "flow" | "state" | "comparison" | "pyramid" | "circuit";
    nodes: Array<{
      id: string;
      label: string;
      detail?: string;
      status?: "normal" | "warn" | "danger" | "success" | "accent";
      annotation?: string;
    }>;
    connections: Array<{
      from: string;
      to: string;
      label?: string;
      dashed?: boolean;
      highlight?: boolean;
    }>;
  };

  // Full Article Content
  article: {
    overview: string;
    antiPattern: {
      title: string;
      description: string;
      codeSnippet?: string;
      language?: string;
    };
    productionPattern: {
      title: string;
      description: string;
      codeSnippet: string;
      language: string;
    };
    tradeoffs: Array<{
      aspect: string;
      pros: string;
      cons: string;
      recommendation: string;
    }>;
    checklist: string[];
  };
}

export const CODING_DESIGN_TOPICS: CodingDesignTopic[] = [
  {
    id: "retry-messaging-queue-consumers",
    slug: "retry-messaging-queue-consumers",
    title: "Retry Mechanism for Messaging Queue Consumers",
    shortTitle: "Queue Consumer Retries & DLQ",
    category: "Resilience & Retries",
    categoryColor: "emerald",
    difficulty: "CRITICAL",
    readTimeMinutes: 7,
    tags: ["Kafka", "RabbitMQ", "DLQ", "Exponential Backoff", "Poison Pill"],
    summary: {
      rule: "Never retry failed message queue consumers in a tight, synchronous loop on the main topic.",
      whyItMatters: "A single corrupted message (poison pill) or transient dependency failure halts the entire consumer partition, introducing head-of-line blocking and catastrophic lag.",
      whenToUse: "Any asynchronous worker processing Kafka, RabbitMQ, SQS, or Redis Streams messages with external dependencies.",
      verdict: "Use a dedicated Retry Topic with exponential backoff + jitter, bounded maximum attempts (e.g. 3), and route to a Dead Letter Queue (DLQ) with PagerDuty alerts."
    },
    keyTakeaways: [
      "Never sleep the consumer thread on the main partition; forward to retry topics.",
      "Always apply exponential backoff with random jitter to prevent thundering herds.",
      "Set strict max redeliveries before offloading to a Dead Letter Queue (DLQ).",
      "Attach error headers (exception class, stack trace, timestamp, original partition) to DLQ messages."
    ],
    scribble: {
      badge: "CONSUMER RETRY PIPELINE",
      caption: "Non-blocking retry topic topology with exponential backoff and automated DLQ routing",
      diagramType: "flow",
      nodes: [
        { id: "producer", label: "Event Producer", detail: "Publishes orders", status: "normal" },
        { id: "main_topic", label: "Main Topic", detail: "orders.events", status: "accent" },
        { id: "consumer", label: "Consumer Worker", detail: "Throws 503 / DB timeout", status: "warn" },
        { id: "retry_topic", label: "Retry Topic (Delay)", detail: "orders.retry-10s (Jitter)", status: "warn", annotation: "Exponential Delay" },
        { id: "dlq_topic", label: "Dead Letter Queue", detail: "orders.dlq + Alerts", status: "danger", annotation: "Max 3 Retries" },
        { id: "recovery", label: "Manual / Batch Replay", detail: "Admin fix & re-ingest", status: "success" }
      ],
      connections: [
        { from: "producer", to: "main_topic", label: "publish" },
        { from: "main_topic", to: "consumer", label: "poll" },
        { from: "consumer", to: "retry_topic", label: "fail: attempt <= 3", dashed: true },
        { from: "retry_topic", to: "consumer", label: "re-attempt after backoff" },
        { from: "consumer", to: "dlq_topic", label: "fail: attempt > 3", highlight: true },
        { from: "dlq_topic", to: "recovery", label: "diagnose & replay", dashed: true }
      ]
    },
    article: {
      overview: "When consuming messages from message queues (Kafka, RabbitMQ, SQS), consumer failures are inevitable: downstream databases hit connection limits, downstream HTTP APIs return 503s, or payload schemas don't match. If you block the consumer thread or indefinitely re-enqueue to the head of the queue, the consumer halts progress for all subsequent healthy messages on that shard/partition.",
      antiPattern: {
        title: "Anti-Pattern: Synchronous Thread Sleep & Infinite In-Place Retries",
        description: "Calling Thread.sleep() or throwing uncaught exceptions causes the consumer partition to re-deliver the exact same bad message perpetually, exhausting thread pools and accumulating infinite consumer lag.",
        codeSnippet: `// ❌ ANTI-PATTERN: Blocks partition & causes infinite re-deliveries
@KafkaListener(topics = "orders")
public void handleOrder(OrderEvent event) {
    while (true) {
        try {
            paymentGateway.charge(event); // If this fails, thread sleeps forever
            break;
        } catch (Exception e) {
            Thread.sleep(5000); // ❌ BLOCKS consumer, partition lag spikes
        }
    }
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Multi-Tiered Retry Topics with Dead-Letter Quarantine",
        description: "Deliver failures to tiered delay topics (e.g. `topic.retry.10s`, `topic.retry.60s`, `topic.retry.300s`) or a Dead Letter Queue when maximum attempts are exceeded, preserving partition throughput.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Spring Kafka NonBlocking Retries with DLQ
@Configuration
public class KafkaRetryConfig {

    @Bean
    public RetryTopicConfiguration orderRetryConfiguration(KafkaTemplate<String, Object> template) {
        return RetryTopicConfigurationBuilder
            .newInstance()
            .maxAttempts(4)
            .exponentialBackoff(2000, 2.0, 30000) // 2s, 4s, 8s max 30s
            .includeTopic("orders.events")
            .dltHandlerMethod("orderDltConsumer", "handleDeadLetter")
            .create(template);
    }
}

@Component
public class OrderDltConsumer {
    private static final Logger log = LoggerFactory.getLogger(OrderDltConsumer.class);

    public void handleDeadLetter(OrderEvent payload, 
                                 @Header(KafkaHeaders.ORIGINAL_TOPIC) String origTopic,
                                 @Header(KafkaHeaders.EXCEPTION_MESSAGE) String error) {
        log.error("POISON PILL QUARANTINED: originalTopic={} error={}", origTopic, error);
        // Alert on-call via metrics/PagerDuty + persist to audit triage database
        metrics.increment("orders.dlq.count");
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "In-Place vs Topic Retries",
          pros: "Topic retries maintain partition flow and process healthy messages immediately.",
          cons: "Messages in retry topics may complete out-of-order relative to the main topic.",
          recommendation: "Use topic-based retries unless strict FIFO per aggregate key is mandatory. If FIFO is strictly required, pause partition consumption until healed."
        },
        {
          aspect: "DLQ Storage & Eviction",
          pros: "Prevents data loss and isolates poison pills.",
          cons: "DLQ can silently grow into gigabytes if not monitored.",
          recommendation: "Attach TTL (e.g. 14 days) and alert whenever DLQ receives > 0 messages."
        }
      ],
      checklist: [
        "Are consumer retries bounded to a maximum number (e.g. 3 to 5 attempts)?",
        "Does the retry delay use exponential backoff with random jitter?",
        "Is every message sent to the DLQ tagged with original partition, offset, timestamp, and exception stack trace?",
        "Is there an automated alert whenever any message lands in the DLQ?"
      ]
    }
  },
  {
    id: "retry-external-api-circuit-breaker",
    slug: "retry-external-api-circuit-breaker",
    title: "Retry for External API Calls & Circuit Breakers",
    shortTitle: "External API Retries & Circuit Breakers",
    category: "Resilience & Retries",
    categoryColor: "emerald",
    difficulty: "CRITICAL",
    readTimeMinutes: 8,
    tags: ["Resilience4j", "Circuit Breaker", "Exponential Backoff", "Full Jitter", "Idempotency"],
    summary: {
      rule: "Never retry blind POST requests without idempotency keys, and always protect external calls with a circuit breaker and backoff jitter.",
      whyItMatters: "Blind retries on payment or mutation APIs cause double charges and thundering herds that take down recovering third-party services.",
      whenToUse: "Every outbound HTTP/gRPC network call to external SaaS, payment gateways, microservices, or partner APIs.",
      verdict: "Combine Circuit Breaker (fail-fast on elevated error rates) + Exponential Backoff with Full Jitter + strictly enforce Idempotency-Key headers on mutating POST/PUT requests."
    },
    keyTakeaways: [
      "Only retry transient HTTP codes (408, 429, 502, 503, 504, connect timeouts); never retry 400, 401, 403, 404.",
      "Always attach an `Idempotency-Key` (UUIDv4) to all retryable mutating requests.",
      "Use Full Jitter: sleep = random(0, min(max_backoff, base * 2^attempt)).",
      "Trip the Circuit Breaker to OPEN when error rates cross 50% to prevent connection pool exhaustion."
    ],
    scribble: {
      badge: "CIRCUIT BREAKER & RETRY STATE",
      caption: "Circuit Breaker state transitions integrated with jittered idempotency retries",
      diagramType: "circuit",
      nodes: [
        { id: "caller", label: "Your Application", detail: "POST /v1/charges", status: "normal" },
        { id: "circuit", label: "Circuit Breaker", detail: "CLOSED (Healthy)", status: "accent", annotation: "50% failure trips to OPEN" },
        { id: "retry_engine", label: "Retry Engine", detail: "Jitter + IdempotencyKey", status: "warn" },
        { id: "external_api", label: "Partner Gateway", detail: "Returns 503 Service Unavailable", status: "danger" },
        { id: "fallback", label: "Degraded Fallback", detail: "Queue for async reconciliation", status: "success" }
      ],
      connections: [
        { from: "caller", to: "circuit", label: "execute call" },
        { from: "circuit", to: "external_api", label: "state = CLOSED" },
        { from: "external_api", to: "retry_engine", label: "503 timeout / transient err", dashed: true },
        { from: "retry_engine", to: "external_api", label: "backoff + jitter (attempt 2/3)" },
        { from: "circuit", to: "fallback", label: "state = OPEN (fail-fast)", highlight: true }
      ]
    },
    article: {
      overview: "Network requests over the internet will fail. The difference between a resilient system and a fragile one is how retries are orchestrated. A naive retry policy turns a temporary blip into an outage by hammering the downstream dependency with thousands of synchronized requests.",
      antiPattern: {
        title: "Anti-Pattern: Immediate Unbounded Retries on Mutating Calls",
        description: "Retrying HTTP POST without an idempotency key can charge a customer's credit card twice if the first request succeeded on the server but timed out returning the response.",
        codeSnippet: `// ❌ DANGEROUS: No backoff, no jitter, no idempotency key
for (int i = 0; i < 3; i++) {
    try {
        return restTemplate.postForObject("https://pay.stripe.com/charges", request, Response.class);
    } catch (RestClientException ex) {
        // Immediate retry: If first call succeeded on Stripe but timed out, customer charged 3x!
    }
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Resilience4j Circuit Breaker + Jittered Retry",
        description: "Configure explicit retryable status codes, attach an immutable Idempotency-Key per business transaction, and fail-fast with a circuit breaker when the remote service is down.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Circuit Breaker + Retry with Idempotency Key
@Service
public class ResilientPaymentClient {

    private final RestClient restClient;

    @CircuitBreaker(name = "paymentGateway", fallbackMethod = "paymentFallback")
    @Retry(name = "paymentRetry")
    public PaymentResponse chargeCard(PaymentRequest request, String idempotencyKey) {
        return restClient.post()
            .uri("/v1/charges")
            .header("Idempotency-Key", idempotencyKey)
            .body(request)
            .retrieve()
            .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                throw new TransientGatewayException("Remote 5xx gateway error: " + res.getStatusCode());
            })
            .body(PaymentResponse.class);
    }

    public PaymentResponse paymentFallback(PaymentRequest request, String key, Throwable ex) {
        log.warn("Payment gateway circuit OPEN or exhausted retries. Falling back to pending queue. Reason: {}", ex.getMessage());
        return PaymentResponse.queuedForReconciliation(request.getOrderId(), key);
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Exponential Backoff vs Jitter",
          pros: "Jitter distributes retry bursts evenly across time.",
          cons: "Slightly less predictable execution windows.",
          recommendation: "Always use Full Jitter for network calls: t = rand(0, base * 2^attempt)."
        },
        {
          aspect: "Circuit Breaker Thresholds",
          pros: "Prevents waiting for slow timeouts when a dependency is dead.",
          cons: "Overly sensitive thresholds trip during minor hiccups.",
          recommendation: "Set minimum calls to 20, failure rate to 50%, and wait duration in OPEN to 15-30s."
        }
      ],
      checklist: [
        "Are retries restricted to transient 5xx and connection timeouts (never 4xx)?",
        "Does every mutating call pass an immutable Idempotency-Key header?",
        "Is full jitter configured to desynchronize retry spikes?",
        "Is a circuit breaker configured to prevent thread exhaustion when remote APIs go down?"
      ]
    }
  },
  {
    id: "traceability-distributed-logging",
    slug: "traceability-distributed-logging",
    title: "Traceability of Logs & Distributed Tracing",
    shortTitle: "Distributed Tracing & Correlation IDs",
    category: "Observability & Logging",
    categoryColor: "blue",
    difficulty: "CRITICAL",
    readTimeMinutes: 7,
    tags: ["OpenTelemetry", "MDC", "trace_id", "span_id", "B3 Propagation"],
    summary: {
      rule: "Every log entry must carry a globally unique `trace_id` and `span_id` propagated across all microservices, async threads, and message queues.",
      whyItMatters: "Without trace IDs, debugging a production error across 6 microservices and 3 queues requires cross-referencing timestamps, turning a 2-minute root cause into a 4-hour wild goose chase.",
      whenToUse: "All multi-service systems, event-driven architectures, and async job workers.",
      verdict: "Inject `trace_id` and `span_id` at the API Gateway via W3C `traceparent` headers, preserve them in Slf4j MDC, and forward them in Kafka/RabbitMQ headers."
    },
    keyTakeaways: [
      "Generate or accept W3C `traceparent` (or `X-Trace-Id`) at ingress.",
      "Populate logging Mapped Diagnostic Context (MDC) so all logger outputs automatically include trace metadata.",
      "Ensure thread pool executors wrap runnables to propagate MDC context across async boundaries.",
      "Include trace IDs in all error responses sent back to the client (`error_id` / `trace_id`)."
    ],
    scribble: {
      badge: "DISTRIBUTED CONTEXT PROPAGATION",
      caption: "Trace context flowing through HTTP ingress, async thread pools, and messaging queues",
      diagramType: "flow",
      nodes: [
        { id: "client", label: "Client Request", detail: "POST /orders", status: "normal" },
        { id: "gateway", label: "API Gateway", detail: "Generate trace_id: 8f9b2c", status: "accent", annotation: "Inject traceparent" },
        { id: "svc_order", label: "Order Service", detail: "MDC: trace=8f9b2c span=01", status: "success" },
        { id: "kafka", label: "Kafka Broker", detail: "Header: traceparent=8f9b2c", status: "normal" },
        { id: "svc_billing", label: "Billing Worker", detail: "MDC: trace=8f9b2c span=02", status: "success" },
        { id: "loki", label: "Log Aggregator", detail: "Search {trace_id='8f9b2c'}", status: "accent" }
      ],
      connections: [
        { from: "client", to: "gateway", label: "HTTP Request" },
        { from: "gateway", to: "svc_order", label: "W3C traceparent header" },
        { from: "svc_order", to: "kafka", label: "produce with headers" },
        { from: "kafka", to: "svc_billing", label: "consume & extract trace" },
        { from: "svc_order", to: "loki", label: "JSON log output", dashed: true },
        { from: "svc_billing", to: "loki", label: "JSON log output", dashed: true }
      ]
    },
    article: {
      overview: "In modern distributed architectures, a single user click cascades through multiple microservices, background queues, and database calls. Log traceability guarantees that any line written to stdout can be immediately connected to the originating user request.",
      antiPattern: {
        title: "Anti-Pattern: Isolated Local Log Statements",
        description: "Writing logs with raw text messages and no request identifier leaves log aggregators with millions of disconnected lines that cannot be filtered or correlated.",
        codeSnippet: `// ❌ ANTI-PATTERN: Zero correlation, impossible to trace in production
log.error("Failed to process transaction for user: " + userId + ", error: " + ex.getMessage());
// In a service with 10k req/sec, which HTTP request triggered this? What was upstream?`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: MDC Filter with W3C Context Propagation",
        description: "Extract incoming trace headers or generate fresh UUIDs, store in Slf4j MDC, and configure Logback or JSON log formatters to append `trace_id` to every line automatically.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Servlet Filter for MDC Trace Context
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TraceContextFilter extends OncePerRequestFilter {

    public static final String TRACE_ID_KEY = "traceId";
    public static final String TRACE_HEADER = "X-Trace-Id";

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) 
            throws ServletException, IOException {
        String traceId = req.getHeader(TRACE_HEADER);
        if (traceId == null || traceId.isBlank()) {
            traceId = UUID.randomUUID().toString().replace("-", "");
        }

        try {
            MDC.put(TRACE_ID_KEY, traceId);
            res.setHeader(TRACE_HEADER, traceId);
            chain.doFilter(req, res);
        } finally {
            MDC.remove(TRACE_ID_KEY); // Prevent memory leaks in pooled threads
        }
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Custom Headers vs OpenTelemetry W3C",
          pros: "W3C `traceparent` is natively understood by APMs (Datadog, New Relic, Jaeger).",
          cons: "Slightly more complex specification format.",
          recommendation: "Adopt standard W3C `traceparent` format: `00-{trace_id}-{span_id}-{flags}`."
        },
        {
          aspect: "MDC in Async / Reactive WebFlux",
          pros: "Instant correlation in standard multi-threaded servlets.",
          cons: "Reactive streams (Project Reactor) switch threads dynamically, losing MDC unless hooked.",
          recommendation: "Use Micrometer Tracing or Reactor ContextWrite to propagate context across Mono/Flux."
        }
      ],
      checklist: [
        "Does every HTTP response header return the `X-Trace-Id` or `traceparent`?",
        "Do JSON logs output `trace_id` and `span_id` as top-level indexed fields?",
        "Is MDC cleaned up in a `finally` block to prevent thread pool pollution?",
        "Do message queue producers serialize trace context into message headers?"
      ]
    }
  },
  {
    id: "minimal-insightful-logging",
    slug: "minimal-insightful-logging",
    title: "Minimal Usage of Logs & Only Insightful Logs",
    shortTitle: "Minimal & Insightful Logging",
    category: "Observability & Logging",
    categoryColor: "blue",
    difficulty: "ESSENTIAL",
    readTimeMinutes: 6,
    tags: ["Log Hygiene", "Structured JSON", "Log Aggregation", "Sampling", "PII Masking"],
    summary: {
      rule: "Do not log inside tight loops or echo full request/response bodies; log only state transitions, business milestones, and actionable errors.",
      whyItMatters: "Excessive logging wastes millions in cloud ingestion costs (Datadog/Splunk), degrades disk I/O, drowns critical alerts in noise, and leaks customer PII.",
      whenToUse: "Across every service, cron job, batch processing script, and API endpoint.",
      verdict: "Use structured JSON with strict log levels (DEBUG for dev, INFO for key lifecycle milestones, WARN for handled anomalies, ERROR for action-required failures). Never log PII."
    },
    keyTakeaways: [
      "Never log inside a loop iterating over thousands of items; emit one summary log after the loop.",
      "Never log passwords, CVVs, API tokens, or unmasked credit card numbers.",
      "ERROR level must mean: an engineer needs to be notified or take action.",
      "Prefer metrics (counters/timers) over logs for high-frequency measurements."
    ],
    scribble: {
      badge: "LOG VOLUME HYGIENE",
      caption: "Replacing noisy loop spew with high-yield structured milestone telemetry",
      diagramType: "comparison",
      nodes: [
        { id: "bad_loop", label: "❌ NOISY: 10,000 logs/sec", detail: "log.info('Processing item: ' + id)", status: "danger", annotation: "$10k/mo Datadog bill" },
        { id: "good_summary", label: "✅ INSIGHTFUL: 1 log", detail: "log.info('Batch complete', total=10000, failed=2, durationMs=340)", status: "success", annotation: "Structured & Actionable" },
        { id: "pii_mask", label: "PII Sanitizer", detail: "Mask email, phone, card tokens", status: "accent" },
        { id: "error_rule", label: "ERROR = Actionable", detail: "If no on-call action needed -> WARN", status: "normal" }
      ],
      connections: [
        { from: "bad_loop", to: "good_summary", label: "refactor to batch metrics" },
        { from: "good_summary", to: "pii_mask", label: "scrub sensitive fields" },
        { from: "good_summary", to: "error_rule", label: "strict log level triage" }
      ]
    },
    article: {
      overview: "Logging everything feels safe during development, but in production, log spew is a silent killer. Disk write saturation, elevated CPU usage during string interpolation, massive cloud bills, and security audits for leaked PII are the direct consequences of unmanaged logging.",
      antiPattern: {
        title: "Anti-Pattern: Verbose Loop Spew & Leaked Customer Data",
        description: "Logging inside every iteration of a processing loop floods stdout and introduces severe latency bottlenecks.",
        codeSnippet: `// ❌ ANTI-PATTERN: Kills I/O and leaks raw customer PII
for (UserAccount user : userList) { // 100,000 items
    log.info("Processing user email: {}, passwordHash: {}, card: {}", 
             user.getEmail(), user.getPasswordHash(), user.getCardNumber());
    // Writes 100,000 lines to disk per minute!
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Structured Milestone Summary & Metrics",
        description: "Collect high-cardinality counts into in-memory counters or timers, and emit a single structured summary upon completion.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Batch summary + metrics increment
int processed = 0;
int failed = 0;
long startTime = System.currentTimeMillis();

for (UserAccount user : userList) {
    try {
        processSingleAccount(user);
        processed++;
    } catch (Exception ex) {
        failed++;
        log.warn("Account migration failed: accountId={} reason={}", user.getId(), ex.getMessage());
    }
}

// Single insightful summary log
long duration = System.currentTimeMillis() - startTime;
log.info("Account batch processed: total={}, success={}, failed={}, durationMs={}", 
         userList.size(), processed, failed, duration);
meterRegistry.counter("batch.accounts.processed").increment(processed);
meterRegistry.timer("batch.accounts.duration").record(Duration.ofMillis(duration));`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Logs vs Metrics",
          pros: "Metrics (Prometheus counters/gauges) consume near-zero disk and visualize trends instantly.",
          cons: "Metrics lack stack traces and deep contextual payload details.",
          recommendation: "Use metrics for rate, error count, and durations; use logs for rare anomalies and diagnostic traces."
        },
        {
          aspect: "Sampling High-Volume Logs",
          pros: "Prevents log storage exhaustion while maintaining statistical observability.",
          cons: "May miss a specific user's trace during low-probability edge cases.",
          recommendation: "Sample INFO logs at 1-5% in high-traffic endpoints; log 100% of WARN and ERROR events."
        }
      ],
      checklist: [
        "Are there any log statements inside `for`/`while` loops?",
        "Are all logged messages structured with key-value placeholders (no string concatenation)?",
        "Is there automated PII masking in your logging configuration for emails, tokens, and cards?",
        "Does every ERROR log require an on-call engineer to inspect or remediate?"
      ]
    }
  },
  {
    id: "idempotency-for-apis",
    slug: "idempotency-for-apis",
    title: "Idempotency for APIs",
    shortTitle: "API Idempotency & Deduplication",
    category: "API Contracts & Errors",
    categoryColor: "purple",
    difficulty: "CRITICAL",
    readTimeMinutes: 8,
    tags: ["Idempotency-Key", "Redis SETNX", "Distributed Lock", "Double Submit", "Stripe Pattern"],
    summary: {
      rule: "Any mutating API (POST/PUT) that performs money transfers, order creation, or external side-effects must be strictly idempotent.",
      whyItMatters: "Network timeouts, user double-clicks, and automated retries will duplicate financial transactions or duplicate physical shipments without idempotency guarantees.",
      whenToUse: "Payment processing, order checkout, inventory reservation, and webhooks.",
      verdict: "Accept an `Idempotency-Key` header, acquire an atomic Redis lock (`SETNX` with TTL), check for existing cached responses, and return the identical result without re-executing logic."
    },
    keyTakeaways: [
      "Client generates a unique `Idempotency-Key` (UUIDv4) per logical intent.",
      "Store idempotency states: `PROCESSING` (in-flight lock) and `COMPLETED` (cached response).",
      "If a duplicate request arrives while `PROCESSING`, return HTTP `409 Conflict` or poll wait.",
      "Store the hashed request payload alongside the key to detect payload tampering."
    ],
    scribble: {
      badge: "IDEMPOTENCY EXECUTION FLOW",
      caption: "Atomic Redis state checking, duplicate lock detection, and cached response replaying",
      diagramType: "flow",
      nodes: [
        { id: "client", label: "Client App", detail: "POST /v1/payments (Key: abc-123)", status: "normal" },
        { id: "redis_check", label: "Redis State Lookup", detail: "GET idempotency:abc-123", status: "accent" },
        { id: "in_flight", label: "Is PROCESSING?", detail: "Return 409 Conflict / Wait", status: "warn", annotation: "Lock Active" },
        { id: "cached", label: "Is COMPLETED?", detail: "Return Cached HTTP 200", status: "success", annotation: "Zero Side-Effects" },
        { id: "execute", label: "Execute Payment", detail: "Charge card & write DB", status: "accent" },
        { id: "save_cache", label: "Cache Response", detail: "Save payload + TTL: 24h", status: "normal" }
      ],
      connections: [
        { from: "client", to: "redis_check", label: "Header: Idempotency-Key" },
        { from: "redis_check", to: "in_flight", label: "status == PROCESSING" },
        { from: "redis_check", to: "cached", label: "status == COMPLETED" },
        { from: "redis_check", to: "execute", label: "key NOT found (acquire lock)" },
        { from: "execute", to: "save_cache", label: "success" },
        { from: "save_cache", to: "client", label: "HTTP 201 Created", dashed: true }
      ]
    },
    article: {
      overview: "In distributed systems, the client never knows with 100% certainty if an unacknowledged HTTP request succeeded on the server. If the connection drops while the server is writing the 200 response, the client has to retry. Idempotency guarantees that executing the same request 1 time or 10 times produces the exact same system state.",
      antiPattern: {
        title: "Anti-Pattern: Blind Mutation Without Transaction Keys",
        description: "Processing a payment endpoint without checking for duplicate tokens causes double charges whenever a user clicks 'Pay' twice or mobile network drops.",
        codeSnippet: `// ❌ ANTI-PATTERN: Double charge nightmare on retry
@PostMapping("/charges")
public ChargeResponse charge(@RequestBody ChargeRequest request) {
    // If client timed out waiting for response and retried, card charged twice!
    return paymentProcessor.charge(request.getAmount(), request.getCardToken());
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Distributed Atomic Idempotency Filter",
        description: "Use Redis `SET key value NX PX 120000` to atomically claim the request token, process business logic, and cache the serialized HTTP response body for subsequent identical requests.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Redis-backed Idempotency Interceptor
@Component
public class IdempotencyHandler {

    private final StringRedisTemplate redisTemplate;

    public Object handleIdempotentCall(String key, Supplier<ResponseEntity<?>> execution) {
        String redisKey = "idempotency:" + key;
        
        // 1. Check if already completed and cached
        String cachedResponse = redisTemplate.opsForValue().get(redisKey + ":result");
        if (cachedResponse != null) {
            log.info("Idempotent hit: replaying cached response for key={}", key);
            return deserialize(cachedResponse);
        }

        // 2. Atomic acquire in-flight lock (120s safety TTL)
        Boolean acquired = redisTemplate.opsForValue().setIfAbsent(redisKey + ":lock", "PROCESSING", Duration.ofSeconds(120));
        if (Boolean.FALSE.equals(acquired)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Concurrent request in progress for this Idempotency-Key.");
        }

        try {
            // 3. Execute actual business transaction
            ResponseEntity<?> result = execution.get();
            
            // 4. Cache response for 24 hours
            redisTemplate.opsForValue().set(redisKey + ":result", serialize(result), Duration.ofHours(24));
            return result;
        } finally {
            redisTemplate.delete(redisKey + ":lock");
        }
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Redis vs Relational DB Storage",
          pros: "Redis provides sub-millisecond atomic locks and native TTL expiration.",
          cons: "If Redis restarts without persistent AOF, idempotency cache could be lost.",
          recommendation: "Store the active lock in Redis; write completed idempotency records to PostgreSQL alongside the primary business transaction."
        },
        {
          aspect: "Payload Fingerprinting",
          pros: "Detects when a malicious client reuses an Idempotency-Key with different payload parameters.",
          cons: "Requires computing a SHA-256 hash of the JSON body.",
          recommendation: "Always hash the request body: if key matches but hash differs, return `422 Unprocessable Entity`."
        }
      ],
      checklist: [
        "Is `Idempotency-Key` validated as a valid UUID or alphanumeric string (length <= 64)?",
        "Does the key lock expire automatically with a safety TTL if the worker crashes?",
        "Are concurrent duplicate requests rejected with `409 Conflict`?",
        "Is the payload SHA-256 verified to reject payload tampering?"
      ]
    }
  },
  {
    id: "redis-cache-when-necessary",
    slug: "redis-cache-when-necessary",
    title: "Redis Cache When Necessary (and When NOT)",
    shortTitle: "Redis Cache When Necessary",
    category: "Database & Performance",
    categoryColor: "amber",
    difficulty: "CRITICAL",
    readTimeMinutes: 7,
    tags: ["Cache-Aside", "Cache Stampede", "TTL Jitter", "Eviction Policies", "Cache Invalidation"],
    summary: {
      rule: "Cache only data with high read-to-write ratios and tolerable eventual consistency; never use Redis as a band-aid for missing database indexes.",
      whyItMatters: "Over-caching dynamic data introduces stale reads, race conditions during cache invalidation, cache stampedes (thundering herd), and memory leaks.",
      whenToUse: "Read-heavy catalogs, user session stores, configuration data, and rate-limiting counters.",
      verdict: "Use the Cache-Aside pattern with mandatory TTL + random jitter. Never cache volatile data updated on every user interaction without strict invalidation guarantees."
    },
    keyTakeaways: [
      "Fix slow SQL queries with indexes first before slapping Redis on top.",
      "Always set a TTL; immortal cache keys will eventually trigger out-of-memory (OOM) evictions.",
      "Add random TTL jitter (`TTL = 3600 + rand(-300, 300)`) to avoid cache avalanche.",
      "Protect against cache stampedes with mutex locking or early probabilistic expiration (XFetch)."
    ],
    scribble: {
      badge: "CACHE-ASIDE PATTERN & JITTER",
      caption: "Read flow through Redis with DB fallback, TTL jitter, and write invalidation",
      diagramType: "flow",
      nodes: [
        { id: "app", label: "Application Service", detail: "GET /products/492", status: "normal" },
        { id: "redis", label: "Redis Cache", detail: "Cache Key: prod:492", status: "accent" },
        { id: "hit", label: "Cache HIT (0.8ms)", detail: "Return JSON payload directly", status: "success" },
        { id: "miss", label: "Cache MISS", detail: "Read from DB replica", status: "warn" },
        { id: "db", label: "PostgreSQL DB", detail: "SELECT * FROM products WHERE id=492", status: "normal" },
        { id: "populate", label: "Populate Cache", detail: "SET prod:492 EX (3600s + Jitter)", status: "accent" }
      ],
      connections: [
        { from: "app", to: "redis", label: "1. Check Cache" },
        { from: "redis", to: "hit", label: "found" },
        { from: "redis", to: "miss", label: "not found" },
        { from: "miss", to: "db", label: "2. Query DB" },
        { from: "db", to: "populate", label: "3. Populate Redis with TTL" },
        { from: "populate", to: "app", label: "4. Return result" }
      ]
    },
    article: {
      overview: "Redis is an extraordinary in-memory data store, but introducing a cache doubles system complexity: now you have two sources of truth that can get out of sync. Many teams add Redis to patch slow database queries instead of writing proper indexes, leading to ghost data and synchronization bugs.",
      antiPattern: {
        title: "Anti-Pattern: Indefinite Caching of Frequently Mutated Entities",
        description: "Caching user profile balances or order statuses without TTLs or invalidation creates persistent consistency bugs where users see outdated bank balances.",
        codeSnippet: `// ❌ ANTI-PATTERN: No TTL, manual sync bugs
public UserAccount getAccount(String id) {
    UserAccount cached = redis.get("account:" + id);
    if (cached != null) return cached;
    UserAccount dbAcc = db.findAccount(id);
    redis.set("account:" + id, dbAcc); // ❌ NO TTL! If an async worker updates DB, cache is permanently stale
    return dbAcc;
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Cache-Aside with TTL Jitter & Invalidation",
        description: "Always set an expiration time augmented with a random jitter to prevent all cached records from expiring simultaneously.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Cache-Aside with Jittered TTL
@Service
public class ProductCatalogService {

    private final StringRedisTemplate redis;
    private final ProductRepository productRepo;
    private static final int BASE_TTL_SECONDS = 3600;

    public ProductDto getProduct(String productId) {
        String cacheKey = "product:" + productId;
        String cachedJson = redis.opsForValue().get(cacheKey);

        if (cachedJson != null) {
            return JsonUtils.fromJson(cachedJson, ProductDto.class);
        }

        // Cache miss: query primary DB
        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new NotFoundException("Product not found: " + productId));

        ProductDto dto = ProductMapper.toDto(product);

        // Add 0-300 seconds of random jitter to prevent cache avalanche
        int jitter = ThreadLocalRandom.current().nextInt(0, 300);
        redis.opsForValue().set(cacheKey, JsonUtils.toJson(dto), Duration.ofSeconds(BASE_TTL_SECONDS + jitter));

        return dto;
    }

    @Transactional
    public void updateProduct(String productId, UpdateProductRequest req) {
        productRepo.update(productId, req);
        // Evict cache immediately on write; do not attempt complex dual writes
        redis.delete("product:" + productId);
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Evict on Write vs Update on Write",
          pros: "Evicting on write is simple and immune to concurrent write reordering.",
          cons: "The very next read will incur a cache miss.",
          recommendation: "Always evict (delete) the cache key on update; let the subsequent read lazily repopulate."
        },
        {
          aspect: "Memory Eviction Policy",
          pros: "`allkeys-lru` guarantees Redis won't crash when memory fills.",
          cons: "Critical non-cached keys (e.g. rate limiter tokens) could be evicted.",
          recommendation: "Use `volatile-lru` if Redis stores both cache and rate-limit counters; ensure all cache keys have TTL."
        }
      ],
      checklist: [
        "Does every single cache key have an explicit TTL?",
        "Is random jitter applied to base TTLs to prevent synchronized expiration?",
        "Are database indexes verified before choosing to add a cache?",
        "Is the cache evicted (deleted) whenever the underlying database record is updated?"
      ]
    }
  },
  {
    id: "state-machine-inventory-movements",
    slug: "state-machine-inventory-movements",
    title: "State Machine for Inventory Movements",
    shortTitle: "State Machines for Inventory",
    category: "Data & State Consistency",
    categoryColor: "purple",
    difficulty: "CRITICAL",
    readTimeMinutes: 8,
    tags: ["Finite State Machine", "Event-Driven", "Audit Trail", "Inventory", "Terminal State"],
    summary: {
      rule: "Model multi-step business entities (inventory, orders, payments) as strict Finite State Machines with explicit transition tables.",
      whyItMatters: "Free-form status columns updated with arbitrary strings lead to impossible states (e.g. shipping an item that was cancelled or refunding a returned item twice).",
      whenToUse: "Inventory reservation, fulfillment lifecycles, order processing, and subscription billing.",
      verdict: "Enforce transition guards, immutable state history logs, and reject illegal state transitions at both domain code and database constraints."
    },
    keyTakeaways: [
      "Declare explicit valid transitions (e.g., `RESERVED -> ALLOCATED -> DISPATCHED`).",
      "Disallow transitions out of terminal states (`CANCELLED`, `COMPLETED`, `REFUNDED`).",
      "Record every transition event with actor, timestamp, previous state, and reason in an audit table.",
      "Use database enum types or check constraints to reject unauthorized status values."
    ],
    scribble: {
      badge: "DETERMINISTIC STATE TRANSITIONS",
      caption: "Finite State Machine graph showing valid transitions, guard conditions, and terminal nodes",
      diagramType: "state",
      nodes: [
        { id: "available", label: "AVAILABLE", detail: "In warehouse stock", status: "normal" },
        { id: "reserved", label: "RESERVED", detail: "Checkout started (TTL: 15m)", status: "accent" },
        { id: "allocated", label: "ALLOCATED", detail: "Payment succeeded", status: "success" },
        { id: "dispatched", label: "DISPATCHED", detail: "Handed to courier (TERMINAL)", status: "success", annotation: "Terminal State" },
        { id: "released", label: "RELEASED", detail: "Cart expired / cancelled", status: "warn" }
      ],
      connections: [
        { from: "available", to: "reserved", label: "reserve()" },
        { from: "reserved", to: "allocated", label: "payment_success" },
        { from: "allocated", to: "dispatched", label: "ship_order" },
        { from: "reserved", to: "released", label: "timeout / cancel", dashed: true },
        { from: "released", to: "available", label: "re-stock" }
      ]
    },
    article: {
      overview: "Physical inventory movements (e.g. e-commerce warehouses, fulfillment centers) cannot be rolled back with an undo button. Once an item is dispatched into a courier van, changing its database row to `CANCELLED` creates an operational disaster. Modeling lifecycles with state machines prevents illegal operations.",
      antiPattern: {
        title: "Anti-Pattern: Unchecked String Status Mutations",
        description: "Allowing controllers to set `order.setStatus(\"CANCELLED\")` regardless of whether the warehouse already printed shipping labels.",
        codeSnippet: `// ❌ ANTI-PATTERN: Direct status overwrite without validation
public void cancelOrder(String orderId) {
    Order order = orderRepo.findById(orderId);
    // If order was already SHIPPED, setting CANCELLED creates ghost inventory!
    order.setStatus("CANCELLED");
    orderRepo.save(order);
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Strongly-Typed Enum State Machine with Guards",
        description: "Encapsulate states and their permissible transitions directly in an enum or dedicated state machine library.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Domain State Machine with Guards
public enum InventoryState {
    AVAILABLE {
        @Override
        public InventoryState transition(InventoryEvent event) {
            if (event == InventoryEvent.RESERVE) return RESERVED;
            throw new IllegalStateTransitionException(this, event);
        }
    },
    RESERVED {
        @Override
        public InventoryState transition(InventoryEvent event) {
            if (event == InventoryEvent.PAYMENT_CONFIRMED) return ALLOCATED;
            if (event == InventoryEvent.TIMEOUT || event == InventoryEvent.CANCEL) return AVAILABLE;
            throw new IllegalStateTransitionException(this, event);
        }
    },
    ALLOCATED {
        @Override
        public InventoryState transition(InventoryEvent event) {
            if (event == InventoryEvent.DISPATCH) return DISPATCHED;
            if (event == InventoryEvent.REFUND_APPROVED) return AVAILABLE;
            throw new IllegalStateTransitionException(this, event);
        }
    },
    DISPATCHED {
        @Override
        public InventoryState transition(InventoryEvent event) {
            // TERMINAL STATE: Cannot transition backwards!
            throw new IllegalStateTransitionException("Cannot cancel an order already dispatched!");
        }
    };

    public abstract InventoryState transition(InventoryEvent event);
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "In-Memory Enum vs Spring StateMachine Library",
          pros: "Enum-based state machines are fast, zero-dependency, and compile-time verified.",
          cons: "Spring StateMachine supports complex hierarchical nested states and persistence out of the box.",
          recommendation: "Use lightweight enum state machines for < 10 states; adopt Spring StateMachine for complex workflows with dozens of sub-states."
        },
        {
          aspect: "Audit Trail Storage",
          pros: "Full auditability of every state change for support and financial compliance.",
          cons: "Requires writing to an append-only audit table on every transition.",
          recommendation: "Always write state transition audit rows within the same local database transaction."
        }
      ],
      checklist: [
        "Are terminal states explicitly defined and blocked from further mutation?",
        "Are state transitions logged to an immutable audit table with timestamp and actor?",
        "Does the database schema enforce valid states via check constraints or enum types?",
        "Are guard conditions checked before initiating downstream physical actions?"
      ]
    }
  },
  {
    id: "transactions-data-consistency",
    slug: "transactions-data-consistency",
    title: "Transactions and Data Consistency",
    shortTitle: "ACID & Distributed Consistency",
    category: "Data & State Consistency",
    categoryColor: "purple",
    difficulty: "CRITICAL",
    readTimeMinutes: 9,
    tags: ["ACID", "Transactional Outbox", "Saga Pattern", "Dual Writes", "Eventual Consistency"],
    summary: {
      rule: "Never perform a dual-write (e.g. write to Database AND publish to Kafka) in a single method without the Transactional Outbox pattern.",
      whyItMatters: "Dual-writes have no atomic guarantee; if the DB commit succeeds but Kafka drops connection, downstream systems fall permanently out of sync.",
      whenToUse: "All microservices publishing domain events after updating internal relational databases.",
      verdict: "Persist the domain entity AND the outbound event into the same relational database in one ACID transaction, then use Change Data Capture (Debezium) or a reliable poller to publish."
    },
    keyTakeaways: [
      "Avoid 2-Phase Commit (2PC) in distributed microservices; it causes high latency and availability bottlenecks.",
      "Dual-writes are inherently broken: one side will eventually fail.",
      "The Transactional Outbox Pattern guarantees at-least-once message publishing.",
      "Consumers must be idempotent to handle duplicate deliveries gracefully."
    ],
    scribble: {
      badge: "TRANSACTIONAL OUTBOX PATTERN",
      caption: "Atomic DB transaction writing both entity and outbox table to eliminate dual-write hazards",
      diagramType: "flow",
      nodes: [
        { id: "client", label: "Client Request", detail: "POST /orders", status: "normal" },
        { id: "local_tx", label: "Atomic ACID Tx", detail: "BEGIN TRANSACTION", status: "accent", annotation: "One DB Transaction" },
        { id: "order_tbl", label: "orders Table", detail: "INSERT order (ID: 101)", status: "success" },
        { id: "outbox_tbl", label: "outbox Table", detail: "INSERT event payload", status: "success" },
        { id: "relay", label: "Debezium CDC / Poller", detail: "Reads outbox table via WAL", status: "normal" },
        { id: "kafka", label: "Kafka Event Broker", detail: "Publish OrderCreated event", status: "accent" }
      ],
      connections: [
        { from: "client", to: "local_tx", label: "create order" },
        { from: "local_tx", to: "order_tbl", label: "write state" },
        { from: "local_tx", to: "outbox_tbl", label: "write event" },
        { from: "outbox_tbl", to: "relay", label: "tail WAL / query", dashed: true },
        { from: "relay", to: "kafka", label: "at-least-once publish" }
      ]
    },
    article: {
      overview: "In a monolithic database, transactions are simple: `BEGIN TRANSACTION ... COMMIT`. In microservices, operations span multiple databases and message brokers. Attempting to write to a local database and immediately send a message to Kafka creates the classic Dual Write Problem.",
      antiPattern: {
        title: "Anti-Pattern: The Fatal Dual-Write",
        description: "Writing to a relational database and immediately calling a message broker in the same Java method.",
        codeSnippet: `// ❌ ANTI-PATTERN: Dual write without atomicity
@Transactional
public void createOrder(Order order) {
    orderRepository.save(order); // DB commit succeeds
    
    // If Kafka broker is down or network blips here:
    kafkaTemplate.send("order-created", new OrderCreatedEvent(order));
    // Tx rolls back or leaves Kafka un-notified! Data inconsistency guaranteed.
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Transactional Outbox with Change Data Capture",
        description: "Save both the order and an outbox event in the same atomic database transaction. An asynchronous CDC pipeline (like Debezium) streams the outbox table to Kafka.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Atomic Transactional Outbox
@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final OutboxRepository outboxRepo;

    @Transactional
    public Order createOrder(CreateOrderCommand cmd) {
        Order order = new Order(cmd.getCustomerId(), cmd.getItems());
        orderRepo.save(order);

        // Atomic write to outbox table within same ACID transaction
        OutboxMessage outbox = new OutboxMessage(
            "Order",
            order.getId().toString(),
            "OrderCreated",
            JsonUtils.toJson(new OrderCreatedEvent(order.getId(), order.getTotal()))
        );
        outboxRepo.save(outbox);

        return order; // Both committed atomically. Debezium or background poller will publish to Kafka!
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Debezium CDC vs Scheduled Outbox Poller",
          pros: "Debezium reads the database write-ahead log (WAL) with sub-second latency and zero DB polling query overhead.",
          cons: "Requires deploying and maintaining Kafka Connect and Debezium instances.",
          recommendation: "Use a simple scheduled SQL poller (`SELECT ... FOR UPDATE SKIP LOCKED`) for small systems; upgrade to Debezium for > 100 events/sec."
        },
        {
          aspect: "Saga Orchestration vs Choreography",
          pros: "Orchestration (central coordinator) keeps business workflow visible in one place.",
          cons: "Single coordinator service handles all transition decisions.",
          recommendation: "Use Orchestrated Sagas (Temporal or Camunda) for financial or multi-step checkout flows."
        }
      ],
      checklist: [
        "Are all database mutations and message publications decoupled via an Outbox table?",
        "Are message consumers idempotent to handle duplicate deliveries from at-least-once outbox relay?",
        "Are distributed transactions handled via Sagas with compensating actions instead of 2PC?",
        "Is there an alert if outbox table records remain un-dispatched for > 60 seconds?"
      ]
    }
  },
  {
    id: "concurrency-control-stock-quantities",
    slug: "concurrency-control-stock-quantities",
    title: "Concurrency Control on Stock Quantities",
    shortTitle: "Stock Concurrency & Locking",
    category: "Database & Performance",
    categoryColor: "amber",
    difficulty: "CRITICAL",
    readTimeMinutes: 8,
    tags: ["Optimistic Locking", "Pessimistic Locking", "SELECT FOR UPDATE", "Redis Lua", "Flash Sale"],
    summary: {
      rule: "Never check stock with a simple `SELECT` and decrement with a separate `UPDATE`; use atomic database updates or distributed Lua scripts.",
      whyItMatters: "During flash sales, 1,000 concurrent requests reading remaining stock = 1 will all believe stock is available, leading to massive overselling.",
      whenToUse: "Flash sales, ticketing systems, inventory deductions, and bank balance debits.",
      verdict: "Use atomic SQL `UPDATE stock = stock - 1 WHERE id = :id AND stock >= 1` or Redis atomic Lua scripts for flash-sale throughput."
    },
    keyTakeaways: [
      "Avoid check-then-act race conditions; the check and mutation must be atomic.",
      "Optimistic locking (`@Version`) is best for low contention; it fails fast under high contention.",
      "Pessimistic locking (`SELECT FOR UPDATE`) holds database locks, which bottlenecks throughput under flash sales.",
      "Redis Lua script (`DECRBY` with check) offloads thousands of QPS from the primary database."
    ],
    scribble: {
      badge: "CONCURRENCY LOCKING STRATEGIES",
      caption: "Comparing naive race conditions against Atomic SQL and In-Memory Redis Lua decr",
      diagramType: "comparison",
      nodes: [
        { id: "race", label: "❌ Check-Then-Act Race", detail: "Read qty=1 -> Wait -> Write qty=0 (Oversold!)", status: "danger", annotation: "Race Condition" },
        { id: "atomic_sql", label: "✅ Atomic SQL Conditional", detail: "UPDATE items SET qty=qty-1 WHERE qty>=1", status: "accent", annotation: "ACID Guaranteed" },
        { id: "redis_lua", label: "⚡ Redis Atomic Lua", detail: "if redis.call('get', key) >= qty then decr", status: "success", annotation: "50,000+ QPS Flash Sale" }
      ],
      connections: [
        { from: "race", to: "atomic_sql", label: "migrate to atomic check" },
        { from: "atomic_sql", to: "redis_lua", label: "scale for flash sales" }
      ]
    },
    article: {
      overview: "Inventory overselling is one of the most common critical bugs in software engineering. When thousands of users race to purchase the last 5 concert tickets, a naive application checking `if (stock > 0)` will suffer from a classic time-of-check to time-of-use (TOCTOU) race condition.",
      antiPattern: {
        title: "Anti-Pattern: Check-Then-Act in Application Memory",
        description: "Fetching the inventory entity, checking the quantity in Java/Node, and updating it in a separate SQL query.",
        codeSnippet: `// ❌ ANTI-PATTERN: Fatal race condition
Inventory inv = repo.findById(productId); // Thread A & B both read qty = 1
if (inv.getQuantity() > 0) {
    inv.setQuantity(inv.getQuantity() - 1);
    repo.save(inv); // Both threads write qty = 0, item sold twice!
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Atomic Conditional SQL or Redis Lua",
        description: "Execute atomic conditional decrements in SQL, checking affected rows, or handle ultra-high traffic with atomic Redis Lua scripts.",
        codeSnippet: `// ✅ PRODUCTION PATTERN 1: Atomic SQL with Affected Row Check
@Modifying
@Query("UPDATE Inventory i SET i.quantity = i.quantity - :qty " +
       "WHERE i.productId = :productId AND i.quantity >= :qty")
int atomicDeductStock(@Param("productId") String productId, @Param("qty") int qty);

// Service implementation
public boolean purchase(String productId, int qty) {
    int rowsUpdated = inventoryRepo.atomicDeductStock(productId, qty);
    if (rowsUpdated == 0) {
        throw new OutOfStockException("Insufficient stock for product: " + productId);
    }
    return true; // Deduction succeeded atomically!
}

// ✅ PRODUCTION PATTERN 2: High-throughput Redis Lua Script
-- Atomic Stock Deduction Lua Script
local key = KEYS[1]
local qty = tonumber(ARGV[1])
local current = tonumber(redis.call('get', key) or '0')

if current >= qty then
    redis.call('decrby', key, qty)
    return 1 -- SUCCESS
else
    return 0 -- OUT OF STOCK
end`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Atomic SQL vs Redis In-Memory Reservation",
          pros: "Atomic SQL is 100% durable in PostgreSQL without data sync lag.",
          cons: "High contention on a single row saturates database row locks.",
          recommendation: "Use Atomic SQL for standard traffic (< 500 QPS/item); use Redis Lua scripts for flash-sale spikes (> 10,000 QPS)."
        },
        {
          aspect: "Pessimistic vs Optimistic Locking",
          pros: "Optimistic locking (`@Version`) never locks the DB row during reads.",
          cons: "Under heavy contention, 99% of transactions fail and retry, spiking CPU.",
          recommendation: "Use Atomic conditional UPDATEs rather than optimistic retry loops."
        }
      ],
      checklist: [
        "Is stock deducted via an atomic conditional SQL query (`WHERE quantity >= :requested`)?",
        "Does the code inspect the number of affected database rows to verify success?",
        "Are flash-sale inventories pre-warmed in Redis with atomic Lua deduction scripts?",
        "Is there an automated inventory reconciliation job comparing Redis counts against physical DB rows?"
      ]
    }
  },
  {
    id: "input-validations-api-contracts",
    slug: "input-validations-api-contracts",
    title: "Input Validations and API Contracts",
    shortTitle: "Input Validation & Boundary Defense",
    category: "API Contracts & Errors",
    categoryColor: "purple",
    difficulty: "ESSENTIAL",
    readTimeMinutes: 7,
    tags: ["Bean Validation", "Fail Fast", "Zod", "Boundary Limits", "SQL Injection"],
    summary: {
      rule: "Validate all untrusted input at the network perimeter; fail fast with descriptive 400 Bad Request envelopes before touching domain logic.",
      whyItMatters: "Missing input validation allows SQL injection, payload-induced denial of service (ReDoS), corrupted databases, and security exploits.",
      whenToUse: "Every public and internal HTTP/gRPC endpoint, webhook handler, and message queue consumer.",
      verdict: "Enforce strict schema validation (Jakarta Bean Validation / Zod), sanitize strings, bound list sizes, and reject unexpected JSON fields."
    },
    keyTakeaways: [
      "Validate at the entry boundary; never let malformed data penetrate the service layer.",
      "Always set maximum string lengths and maximum collection sizes to prevent memory DoS.",
      "Return RFC 7807 structured field-level error messages so clients can fix bad input easily.",
      "Treat internal microservice payloads with the same zero-trust validation as public APIs."
    ],
    scribble: {
      badge: "BOUNDARY VALIDATION SHIELD",
      caption: "Fail-fast validation barrier rejecting malformed payloads before touching database layers",
      diagramType: "flow",
      nodes: [
        { id: "client", label: "External Client", detail: "POST /v1/users", status: "normal" },
        { id: "validator", label: "Perimeter Validator", detail: "Schema, length, regex checks", status: "accent", annotation: "Fail Fast Boundary" },
        { id: "bad_req", label: "400 Bad Request", detail: "RFC 7807 field validation errors", status: "danger", annotation: "Zero DB load" },
        { id: "domain", label: "Domain Logic", detail: "Safe sanitized business entities", status: "success" },
        { id: "db", label: "Clean Database", detail: "Valid, consistent data records", status: "normal" }
      ],
      connections: [
        { from: "client", to: "validator", label: "Raw JSON" },
        { from: "validator", to: "bad_req", label: "Invalid field (e.g. qty < 1)", highlight: true },
        { from: "validator", to: "domain", label: "Valid & Sanitized" },
        { from: "domain", to: "db", label: "Persist" }
      ]
    },
    article: {
      overview: "Input validation is the first line of defense for every software application. Clean code dictates that internal domain services should never have to ask: 'Is this string null? Is this array 10 million items long?' Validate strictly at the controller boundary and let the domain operate on trusted models.",
      antiPattern: {
        title: "Anti-Pattern: Ad-Hoc Validation Scattered Across Services",
        description: "Checking `if (email == null)` deep inside the business service after executing multiple database lookups.",
        codeSnippet: `// ❌ ANTI-PATTERN: Late validation wastes resources and leaks edge cases
@PostMapping("/register")
public User register(@RequestBody UserRegistrationDto dto) {
    // Controller accepts raw input without annotation
    return userService.register(dto); // Service does ad-hoc checks 100 lines deep
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Declarative Schema Validation with Boundary Limits",
        description: "Use declarative annotations with strict length limits, email formats, and number bounds, combined with a global validation exception handler.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Declarative Boundary Validation
public record CreateUserRequest(
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username must be alphanumeric")
    String username,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255)
    String email,

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Must be at least 18 years old")
    @Max(value = 120, message = "Age exceeds maximum allowable limit")
    Integer age,

    @NotEmpty(message = "At least one role must be specified")
    @Size(max = 5, message = "Cannot assign more than 5 roles")
    List<String> roles
) {}

@RestController
@RequestMapping("/v1/users")
public class UserController {
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        // Enters here ONLY if all boundary validations pass
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Strict vs Permissive Validation",
          pros: "Strict validation eliminates injection vectors and malformed states.",
          cons: "Overly restrictive regex can reject valid international phone numbers or emails.",
          recommendation: "Use standard validation libraries (e.g. validator.js / Hibernate Validator) rather than custom regexes."
        },
        {
          aspect: "Reject Unknown Properties",
          pros: "Prevents mass assignment vulnerabilities where attackers inject `isAdmin: true`.",
          cons: "Breaks backward compatibility if an API client sends newer optional fields.",
          recommendation: "Enable `FAIL_ON_UNKNOWN_PROPERTIES` on public mutation APIs."
        }
      ],
      checklist: [
        "Are all controller request bodies annotated with `@Valid`?",
        "Do all string inputs have explicit `@Size(max = ...)` constraints?",
        "Do all array/list inputs have maximum size limits to prevent memory DoS?",
        "Does the API return standardized RFC 7807 error envelopes listing invalid fields?"
      ]
    }
  },
  {
    id: "timeout-configurations",
    slug: "timeout-configurations",
    title: "Timeout Configurations & Cascading Failures",
    shortTitle: "Timeout Configurations & Sockets",
    category: "Resilience & Retries",
    categoryColor: "emerald",
    difficulty: "CRITICAL",
    readTimeMinutes: 7,
    tags: ["Connect Timeout", "Read Timeout", "Cascading Failure", "Thread Exhaustion", "HTTP Client"],
    summary: {
      rule: "Never use default/infinite timeouts on HTTP clients, database pools, or Redis connections; set explicit connect and read timeouts on every client.",
      whyItMatters: "Default timeouts in many frameworks (like Java's HttpURLConnection) are infinite. A slow dependency holding sockets open freezes application worker threads until the entire service crashes.",
      whenToUse: "Every HTTP client, database connection pool (HikariCP), Redis client, gRPC channel, and reverse proxy.",
      verdict: "Set connect timeout short (500ms - 1s), read timeout realistically tight (2s - 5s), and configure global request deadlines to prevent cascading thread starvation."
    },
    keyTakeaways: [
      "Distinguish Connect Timeout (TCP handshake) from Read/Socket Timeout (waiting for data packet).",
      "Total client timeout must always be strictly less than the upstream caller's timeout.",
      "Database connection pool checkout timeouts must be low (e.g., 250ms - 1000ms) to fail fast under load.",
      "Propagate deadlines (gRPC deadlines or `X-Request-Deadline`) down the call graph."
    ],
    scribble: {
      badge: "TIMEOUT BOUNDARY HIERARCHY",
      caption: "Layered timeout configurations preventing thread pool starvation across dependencies",
      diagramType: "flow",
      nodes: [
        { id: "caller", label: "Upstream Caller", detail: "Global Deadline: 5.0s", status: "normal" },
        { id: "gateway", label: "API Gateway", detail: "Request Timeout: 4.0s", status: "accent" },
        { id: "service", label: "Your Microservice", detail: "App Processing: < 500ms", status: "success" },
        { id: "dep_call", label: "Downstream Call", detail: "Connect: 500ms | Read: 2.0s", status: "warn", annotation: "Strictly Bounded" },
        { id: "slow_dep", label: "Slow Partner API", detail: "Hangs indefinitely (120s)", status: "danger" }
      ],
      connections: [
        { from: "caller", to: "gateway", label: "deadline=5s" },
        { from: "gateway", to: "service", label: "timeout=4s" },
        { from: "service", to: "dep_call", label: "enforce 2.5s total" },
        { from: "dep_call", to: "slow_dep", label: "SocketTimeout trips at 2.0s!", highlight: true }
      ]
    },
    article: {
      overview: "Cascading failures happen when one slow internal service brings down every other service in the company. When a downstream microservice experiences high CPU and delays its responses by 30 seconds, upstream services keep worker threads blocked waiting for sockets. Within minutes, thread pools across the entire cluster are saturated.",
      antiPattern: {
        title: "Anti-Pattern: Default Infinite Socket Timeouts",
        description: "Using standard RestTemplate or HttpClient without configuring timeouts leads to infinite socket wait times.",
        codeSnippet: `// ❌ ANTI-PATTERN: Default timeouts are often infinite or 60+ seconds
RestTemplate restTemplate = new RestTemplate(); 
// Under load, if remote API hangs, all 200 Tomcat threads get stuck here indefinitely.`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Layered Connect, Read, and Connection Pool Timeouts",
        description: "Configure explicit connect timeouts, socket read timeouts, and connection-manager acquisition timeouts.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Explicit Production Timeout Configuration
@Configuration
public class HttpClientConfig {

    @Bean
    public RestClient customRestClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        
        // 1. Connect Timeout: Time to establish TCP handshake (Fail fast if server unreachable)
        factory.setConnectTimeout(Duration.ofMillis(750));
        
        // 2. Read Timeout: Time between incoming data packets
        factory.setReadTimeout(Duration.ofMillis(3000));

        return RestClient.builder()
            .requestFactory(factory)
            .baseUrl("https://api.partner.com")
            .build();
    }
}

// Database Connection Pool (HikariCP)
// hikari.connectionTimeout = 1000 (Fail fast if all 50 connections are leased)
// hikari.validationTimeout = 500
// hikari.maxLifetime = 1800000`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Short vs Generous Read Timeouts",
          pros: "Short timeouts free worker threads immediately during incidents.",
          cons: "Legitimate slow batch queries or heavy exports will be aborted prematurely.",
          recommendation: "Separate OLTP synchronous endpoints (timeout 2s) from long-running export/batch endpoints (timeout 30s) onto different clients."
        },
        {
          aspect: "Context Deadlines",
          pros: "If 4.5s of a 5.0s user budget has elapsed, downstream calls abort immediately without starting.",
          cons: "Requires passing context or deadline headers down the call chain.",
          recommendation: "Use gRPC context deadlines or propagate `X-Request-Timeout-Remaining` headers."
        }
      ],
      checklist: [
        "Do all HTTP client instances have non-default connect timeouts (<= 1s)?",
        "Do all HTTP client instances have non-default read timeouts (<= 5s)?",
        "Is HikariCP connectionTimeout configured to <= 1500ms?",
        "Are timeouts shorter than the caller's total timeout budget?"
      ]
    }
  },
  {
    id: "poison-pills-failure-isolation",
    slug: "poison-pills-failure-isolation",
    title: "Poison Pills & Failure Isolation",
    shortTitle: "Poison Pills & Failure Isolation",
    category: "Resilience & Retries",
    categoryColor: "emerald",
    difficulty: "CRITICAL",
    readTimeMinutes: 8,
    tags: ["Poison Pill", "Kafka", "Deserialization Error", "Bulkhead", "DLQ"],
    summary: {
      rule: "Isolate malformed or crash-inducing messages ('poison pills') instantly so they cannot halt consumer loops or take down worker pods.",
      whyItMatters: "A single corrupted message that causes an OutOfMemoryError, infinite loop, or uncaught deserialization exception will crash consumer pods in an endless restart cycle.",
      whenToUse: "All streaming consumers (Kafka, SQS, RabbitMQ), batch import processors, and webhook receivers.",
      verdict: "Use error-handling deserializers (`ErrorHandlingDeserializer`), isolate workloads with Bulkhead patterns, and route poison pills directly to quarantine without retrying."
    },
    keyTakeaways: [
      "Deserialization failures must be intercepted before reaching listener method signatures.",
      "Poison pills should never be retried; retry only transient network or IO exceptions.",
      "Isolate heavy tenant processing into separate worker pools (Bulkhead pattern).",
      "Quarantine poison pills into an isolated dead-letter topic with detailed diagnostic headers."
    ],
    scribble: {
      badge: "POISON PILL QUARANTINE SHIELD",
      caption: "Deserialization error-handling catching corrupted payloads before consumer pod crashes",
      diagramType: "flow",
      nodes: [
        { id: "stream", label: "Kafka Partition", detail: "Offset 402: Malformed JSON", status: "danger", annotation: "Poison Pill" },
        { id: "deserializer", label: "ErrorHandlingDeserializer", detail: "Catches parse exception", status: "accent" },
        { id: "triage", label: "Failure Classifier", detail: "Is transient or fatal?", status: "warn" },
        { id: "quarantine", label: "Quarantine DLQ", detail: "orders.poison-pills + Alert", status: "danger", annotation: "Zero Pod Crashes" },
        { id: "next_msg", label: "Offset 403 (Healthy)", detail: "Processes successfully", status: "success" }
      ],
      connections: [
        { from: "stream", to: "deserializer", label: "poll message" },
        { from: "deserializer", to: "triage", label: "deserialization error" },
        { from: "triage", to: "quarantine", label: "fatal: route immediately", highlight: true },
        { from: "triage", to: "next_msg", label: "advance partition offset", dashed: true }
      ]
    },
    article: {
      overview: "A poison pill is a message placed onto a queue that cannot be processed by the consumer, no matter how many times it is retried. Common causes include unparseable JSON, unexpected null pointers, or payload sizes that exceed memory buffers. If unhandled, the consumer crashes, Kubernetes restarts the pod, the pod re-reads the same poison pill, and crashes again—locking the entire partition.",
      antiPattern: {
        title: "Anti-Pattern: Standard JsonDeserializer Crashing the Poller",
        description: "Using standard deserializers that throw exceptions before Spring Kafka or consumer loop can capture the record.",
        codeSnippet: `// ❌ ANTI-PATTERN: Standard deserializer throws before consumer method is called
props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
// A single message with missing curly brace crashes Kafka consumer thread repeatedly.
// Partition gets stuck forever!`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Spring ErrorHandlingDeserializer with Quarantine Routing",
        description: "Wrap the real deserializer in `ErrorHandlingDeserializer` so parse errors are passed as metadata into the listener and routed to quarantine.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Resilient Kafka Deserialization
@Configuration
public class ConsumerConfig {

    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        
        // Wrap key & value deserializers in ErrorHandlingDeserializers
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, ErrorHandlingDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ErrorHandlingDeserializer.class);
        
        props.put(ErrorHandlingDeserializer.KEY_DESERIALIZER_CLASS, StringDeserializer.class);
        props.put(ErrorHandlingDeserializer.VALUE_DESERIALIZER_CLASS, JsonDeserializer.class);
        
        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> template) {
        // Immediately quarantine deserialization exceptions without retrying
        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(template,
            (rec, ex) -> new TopicPartition("orders.poison-pills", rec.partition()));
            
        DefaultErrorHandler handler = new DefaultErrorHandler(recoverer, new FixedBackOff(0L, 0L));
        handler.addNotRetryableExceptions(DeserializationException.class, MessageConversionException.class);
        return handler;
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Skip vs Quarantine",
          pros: "Quarantine preserves the payload for debugging and manual compensation.",
          cons: "Requires maintaining a dedicated quarantine topic and retention policy.",
          recommendation: "Always write to quarantine with the full original raw byte payload."
        },
        {
          aspect: "Bulkhead Resource Isolation",
          pros: "Prevents a single rogue tenant or queue from exhausting overall CPU/memory.",
          cons: "Requires partitioning threads or deploying separate worker deployments.",
          recommendation: "Deploy separate consumer pods for VIP/high-priority queues vs low-priority background queues."
        }
      ],
      checklist: [
        "Are Kafka listeners configured with `ErrorHandlingDeserializer`?",
        "Are non-retryable exceptions (parse errors, bad schemas) filtered out of retry loops?",
        "Does the consumer acknowledge/commit offsets after routing poison pills to DLQ?",
        "Is there an immediate alert when messages land in the quarantine topic?"
      ]
    }
  },
  {
    id: "scheduled-jobs-reconciliation",
    slug: "scheduled-jobs-reconciliation",
    title: "Scheduled Jobs & Data Reconciliation",
    shortTitle: "Distributed Cron & Reconciliation",
    category: "Data & State Consistency",
    categoryColor: "purple",
    difficulty: "CRITICAL",
    readTimeMinutes: 8,
    tags: ["ShedLock", "Distributed Cron", "Reconciliation Loop", "Idempotent Jobs", "Ledger Audit"],
    summary: {
      rule: "Never run bare in-memory `@Scheduled` cron jobs across multi-instance deployments; always protect them with distributed locks and build shadow reconciliation loops.",
      whyItMatters: "If your app runs 5 replicas, a bare cron job fires 5 times concurrently, sending duplicate billing invoices, charging customers 5x, or producing race conditions.",
      whenToUse: "Periodic billing runs, daily financial ledger reconciliations, subscription renewal checks, and cleanup workers.",
      verdict: "Use ShedLock or Redis distributed locks with safety hold times, make jobs chunked and idempotent, and build daily reconciliation loops comparing system balances."
    },
    keyTakeaways: [
      "Use ShedLock or Redis distributed locks to guarantee single-instance execution.",
      "Configure `lockAtLeastFor` to prevent clock drift from triggering duplicate executions.",
      "Configure `lockAtMostFor` so a crashed worker doesn't freeze the job indefinitely.",
      "Always design reconciliation jobs as 'catch-up' loops comparing internal DB state with external provider state (e.g. Stripe/PayPal)."
    ],
    scribble: {
      badge: "DISTRIBUTED SHEDLOCK & AUDIT",
      caption: "ShedLock coordinating multi-replica cron execution + automated reconciliation audit",
      diagramType: "flow",
      nodes: [
        { id: "node1", label: "App Replica 1", detail: "Cron triggers at 02:00", status: "accent" },
        { id: "node2", label: "App Replica 2", detail: "Cron triggers at 02:00", status: "normal" },
        { id: "shedlock", label: "Distributed Lock Table", detail: "shedlock table in DB / Redis", status: "accent", annotation: "Lock: 15m safety" },
        { id: "exec", label: "Node 1 Wins Lock", detail: "Executes reconciliation chunk", status: "success" },
        { id: "skip", label: "Node 2 Skips", detail: "Already locked -> Exit cleanly", status: "normal" },
        { id: "audit", label: "Reconciliation Ledger", detail: "Flag discrepancies > 0", status: "warn" }
      ],
      connections: [
        { from: "node1", to: "shedlock", label: "acquireLock('billing_recon')" },
        { from: "node2", to: "shedlock", label: "acquireLock('billing_recon')" },
        { from: "shedlock", to: "exec", label: "GRANTED to Node 1" },
        { from: "shedlock", to: "skip", label: "DENIED to Node 2" },
        { from: "exec", to: "audit", label: "compare Internal DB vs Gateway" }
      ]
    },
    article: {
      overview: "In modern cloud deployments, services run across multiple pods or auto-scaled containers. A standard cron annotation (`@Scheduled(cron = \"0 0 2 * * ?\")`) will fire simultaneously on every running pod. Furthermore, external network glitches cause occasional discrepancies between your database and payment providers; an automated reconciliation job detects and repairs these inconsistencies.",
      antiPattern: {
        title: "Anti-Pattern: Unsynchronized Multi-Pod Scheduled Runs",
        description: "Running scheduled jobs in clustered environments without distributed locking triggers race conditions and duplicate emails/charges.",
        codeSnippet: `// ❌ ANTI-PATTERN: Fires on all 5 pods at 02:00 AM!
@Scheduled(cron = "0 0 2 * * ?")
public void runDailyBilling() {
    // 5 pods execute this at the exact same second!
    List<Subscription> subs = subRepo.findDue();
    for (Subscription s : subs) {
        billingGateway.charge(s); // Customers charged 5 times!
    }
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: ShedLock Distributed Coordination & Chunked Processing",
        description: "Enforce single-replica execution via ShedLock, set safety lock boundaries, and process records in idempotent chunks.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: ShedLock + Batch Idempotent Reconciliation
@Component
public class DailyReconciliationJob {

    private final SubscriptionRepository subRepo;
    private final PaymentGatewayClient gatewayClient;

    @Scheduled(cron = "0 0 2 * * ?")
    @SchedulerLock(
        name = "daily_subscription_billing", 
        lockAtLeastFor = "5m",  // Keep lock even if job finishes fast (clock drift guard)
        lockAtMostFor = "30m"   // Auto-release if node dies
    )
    public void runReconciliation() {
        log.info("Acquired distributed lock. Starting daily reconciliation loop.");
        
        int page = 0;
        Page<Subscription> batch;
        do {
            batch = subRepo.findByStatusAndNextBillingDateBefore(
                SubscriptionStatus.ACTIVE, LocalDate.now(), PageRequest.of(page, 100)
            );
            
            for (Subscription sub : batch) {
                reconcileSingleSubscription(sub);
            }
            page++;
        } while (batch.hasNext());
    }

    private void reconcileSingleSubscription(Subscription sub) {
        // Idempotent reconciliation logic: check remote provider state first
        GatewayStatus remote = gatewayClient.getSubscriptionStatus(sub.getGatewaySubId());
        if (remote.isPaid() && !sub.isMarkedPaid()) {
            sub.markPaid();
            subRepo.save(sub);
        }
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Database-backed ShedLock vs Redis Redlock",
          pros: "Relational DB ShedLock uses your existing PostgreSQL/MySQL database without new infrastructure.",
          cons: "Puts minor lock acquisition queries on the relational DB.",
          recommendation: "Use the relational DB ShedLock table unless your scheduled jobs run every few seconds."
        },
        {
          aspect: "Full Scan vs Chunked Keyset Pagination",
          pros: "Chunked pagination keeps memory usage constant regardless of table size.",
          cons: "Requires ordering by immutable auto-incrementing ID.",
          recommendation: "Never load 100k rows into memory (`findAll()`); process in batches of 500."
        }
      ],
      checklist: [
        "Are all `@Scheduled` tasks guarded with `@SchedulerLock` in clustered environments?",
        "Are both `lockAtLeastFor` and `lockAtMostFor` explicitly defined?",
        "Do reconciliation jobs process items in bounded batches (pagination or cursor)?",
        "Does the job record audit metrics (records scanned, reconciled, mismatches flagged)?"
      ]
    }
  },
  {
    id: "secure-production-app-config",
    slug: "secure-production-app-config",
    title: "Keep App Config Behind Security on PROD",
    shortTitle: "Secure Production App Config",
    category: "Ops, Config & Security",
    categoryColor: "rose",
    difficulty: "CRITICAL",
    readTimeMinutes: 7,
    tags: ["Vault", "AWS Secrets Manager", "Zero Trust", "Dynamic Config", "RBAC"],
    summary: {
      rule: "Never commit plaintext secrets or config files to Git; inject production configs dynamically through secure secret stores with strict role-based access.",
      whyItMatters: "Exposed API keys, database credentials, and production toggle endpoints in source code lead to total infrastructure compromise and data breaches.",
      whenToUse: "All environments, specifically production credentials, database passwords, payment gateway tokens, and encryption keys.",
      verdict: "Use HashiCorp Vault, AWS Secrets Manager, or Kubernetes Secrets with envelope encryption. Gate production runtime config updates behind strict multi-factor auth and audit logs."
    },
    keyTakeaways: [
      "Zero secrets in Git repositories (enforce via pre-commit GitGuardian / gitleaks).",
      "Inject secrets via environment variables or ephemeral memory mounts at runtime.",
      "Dynamic configuration endpoints (e.g. Spring Boot `/actuator/env`) must never be exposed publicly.",
      "Rotate production database passwords automatically using short-lived dynamic credentials."
    ],
    scribble: {
      badge: "ZERO-TRUST SECRET INJECTION",
      caption: "Secure runtime injection from KMS/Vault into ephemeral pod memory without Git exposure",
      diagramType: "flow",
      nodes: [
        { id: "git", label: "Git Repository", detail: "Code ONLY (Zero Secrets)", status: "normal", annotation: "Gitleaks Scan" },
        { id: "ci_cd", label: "CI/CD Pipeline", detail: "Builds immutable container image", status: "normal" },
        { id: "vault", label: "HashiCorp Vault / KMS", detail: "Encrypted secrets & dynamic creds", status: "accent", annotation: "Strict RBAC" },
        { id: "k8s_pod", label: "Production Pod", detail: "Injects into in-memory ENV at boot", status: "success" },
        { id: "actuator", label: "Actuator / Config Endpoints", detail: "Protected behind VPN / Internal Auth", status: "danger", annotation: "Never Public" }
      ],
      connections: [
        { from: "git", to: "ci_cd", label: "commit" },
        { from: "ci_cd", to: "k8s_pod", label: "deploy container" },
        { from: "vault", to: "k8s_pod", label: "mTLS secret lease", highlight: true },
        { from: "k8s_pod", to: "actuator", label: "internal only", dashed: true }
      ]
    },
    article: {
      overview: "Security breaches frequently stem from simple operational mistakes: a developer commits a `.env` file containing AWS keys, or an unprotected `/actuator/env` endpoint allows an attacker to dump database passwords in plaintext. Production configuration must be treated with zero-trust isolation.",
      antiPattern: {
        title: "Anti-Pattern: Hardcoded Secrets and Public Config Endpoints",
        description: "Hardcoding database credentials in application.yml or leaving Spring Actuator endpoints publicly reachable on the web.",
        codeSnippet: `// ❌ ANTI-PATTERN: application.yml committed to Git
spring:
  datasource:
    url: jdbc:postgresql://prod-db.internal:5432/orders
    username: admin
    password: SuperSecretPassword123! # ❌ COMMITTED TO GIT!
management:
  endpoints:
    web:
      exposure:
        include: "*" # ❌ Exposes /actuator/env and /actuator/heapdump to the public internet!`,
        language: "yaml"
      },
      productionPattern: {
        title: "Production Pattern: Cloud Secret Injection & Actuator Lockdown",
        description: "Reference environment variables populated dynamically from AWS Secrets Manager or Kubernetes Secrets, and lock Actuator behind internal port authentication.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Dynamic Config & Security Isolation
// application.yml
spring:
  datasource:
    url: \${DB_URL}
    username: \${DB_USER}
    password: \${DB_PASSWORD} # Injected at runtime from Vault / K8s secret

management:
  server:
    port: 9090 # Run management endpoints on a separate private internal port!
  endpoints:
    web:
      exposure:
        include: health,info,prometheus # Only expose safe metrics; never env/heapdump
      base-path: /internal/management
  endpoint:
    health:
      show-details: when_authorized

// SecurityConfig.java
@Configuration
public class ManagementSecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .securityMatcher("/internal/management/**")
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/internal/management/health").permitAll()
                .anyRequest().hasRole("OPS_ADMIN") // Strict RBAC for operational toggles
            )
            .httpBasic(Customizer.withDefaults())
            .build();
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Static Environment Variables vs Dynamic Vault Secrets",
          pros: "Dynamic Vault leases generate temporary 1-hour credentials that automatically expire.",
          cons: "Requires Vault sidecar agent integration in Kubernetes.",
          recommendation: "Use standard K8s Secret injection for early stages; upgrade to dynamic Vault leases for PCI-DSS/SOC2 compliance."
        },
        {
          aspect: "Runtime Hot Reloading",
          pros: "Update configurations without restarting pods.",
          cons: "Can lead to inconsistent states if pods reload config at different times.",
          recommendation: "Prefer immutable pod rollouts over dynamic hot reloading for critical configuration changes."
        }
      ],
      checklist: [
        "Are pre-commit hooks (gitleaks) configured to block secret commits to GitHub?",
        "Are all management/actuator endpoints moved to a non-public port or blocked at the API gateway?",
        "Are production secrets injected dynamically from a secure vault or secret manager?",
        "Is there an audit log recording every access to production configuration values?"
      ]
    }
  },
  {
    id: "testing-strategy-pyramid",
    slug: "testing-strategy-pyramid",
    title: "Testing Strategy: The Modern Testing Pyramid",
    shortTitle: "Testing Strategy & Testcontainers",
    category: "Ops, Config & Security",
    categoryColor: "rose",
    difficulty: "ESSENTIAL",
    readTimeMinutes: 7,
    tags: ["Testcontainers", "Integration Tests", "Unit Tests", "Mocking", "E2E Testing"],
    summary: {
      rule: "Build a balanced testing pyramid: fast unit tests for domain logic, containerized integration tests (Testcontainers) for data access, and selective E2E tests.",
      whyItMatters: "Relying solely on unit tests with mocked databases creates a false sense of security; tests pass locally, but fail in production on real SQL dialect differences.",
      whenToUse: "Across all software services and libraries.",
      verdict: "Test business rules in pure unit tests without Spring context (sub-millisecond). Test real queries against real PostgreSQL/Redis instances using Testcontainers in CI."
    },
    keyTakeaways: [
      "Never use H2 in-memory DB to test PostgreSQL-specific features (JSONB, window functions, locking).",
      "Keep unit tests independent of external frameworks for lightning-fast feedback.",
      "Use Testcontainers to spin up real Dockerized databases and Kafka in integration tests.",
      "Reserve expensive end-to-end (E2E) browser tests for top 5 critical user journeys."
    ],
    scribble: {
      badge: "THE PRAGMATIC TESTING PYRAMID",
      caption: "Ratio of tests, execution speed, and fidelity across testing layers",
      diagramType: "pyramid",
      nodes: [
        { id: "e2e", label: "10% E2E Smoke Tests", detail: "Playwright / Cypress on staging (Slow)", status: "warn", annotation: "Top 5 User Flows" },
        { id: "integration", label: "20% Integration Tests", detail: "Testcontainers (Real Postgres & Kafka)", status: "accent", annotation: "High Fidelity" },
        { id: "unit", label: "70% Pure Unit Tests", detail: "Pure domain logic & mockito (Sub-second)", status: "success", annotation: "Instant Feedback" }
      ],
      connections: [
        { from: "unit", to: "integration", label: "verify contracts" },
        { from: "integration", to: "e2e", label: "verify end-to-end journey" }
      ]
    },
    article: {
      overview: "A brittle test suite slows down engineering velocity. When developers wait 45 minutes for E2E tests that randomly fail due to network timeouts, they stop running tests. A healthy testing strategy gives high confidence with minimal execution time.",
      antiPattern: {
        title: "Anti-Pattern: In-Memory H2 Mismatch & Heavy Mocking",
        description: "Testing PostgreSQL queries against an in-memory H2 database. H2 ignores locking semantics, JSONB operators, and Postgres-specific constraints.",
        codeSnippet: `// ❌ ANTI-PATTERN: Test passes on H2, fails on production Postgres!
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY) // Uses H2 in-memory
class OrderRepoTest {
    @Test
    void testLocking() {
        // H2 completely ignores SELECT FOR UPDATE SKIP LOCKED
        // Test passes, but deadlocks in production under concurrent traffic!
    }
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Real Database Testing with Testcontainers",
        description: "Spin up an authentic PostgreSQL Docker container automatically during JUnit test execution.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Testcontainers for 100% Real PostgreSQL Fidelity
@SpringBootTest
@Testcontainers
class OrderRepositoryIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private OrderRepository orderRepo;

    @Test
    void testConcurrentInventoryDeduction() {
        // Tests real PostgreSQL row locking and constraint behavior
        int updated = orderRepo.atomicDeductStock("prod_1", 1);
        assertThat(updated).isEqualTo(1);
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Testcontainers vs In-Memory Mocks",
          pros: "100% fidelity: tests exact SQL dialects, triggers, constraints, and indexes.",
          cons: "Takes 5-10 seconds to pull and boot Docker containers on initial test run.",
          recommendation: "Use Testcontainers with reusable mode enabled (`.withReuse(true)`) in local dev."
        },
        {
          aspect: "Mocking Third-Party APIs",
          pros: "WireMock allows simulating network delays, 500 errors, and malformed responses.",
          cons: "Mocks can drift if the external partner changes their API without notice.",
          recommendation: "Use WireMock for integration test suites; complement with consumer-driven contract tests (Pact)."
        }
      ],
      checklist: [
        "Do unit tests execute in under 30 seconds for the entire repository?",
        "Are integration tests executed against real containerized databases (Testcontainers)?",
        "Are external network calls mocked using WireMock rather than hitting live third-party staging?",
        "Does CI block pull requests that fail test assertions or drop branch coverage?"
      ]
    }
  },
  {
    id: "graceful-degradation-healthiness-probe",
    slug: "graceful-degradation-healthiness-probe",
    title: "Graceful Degradation & Healthiness Probes",
    shortTitle: "Graceful Degradation & K8s Probes",
    category: "Resilience & Retries",
    categoryColor: "emerald",
    difficulty: "CRITICAL",
    readTimeMinutes: 7,
    tags: ["Liveness Probe", "Readiness Probe", "Load Shedding", "Kubernetes", "Degradation"],
    summary: {
      rule: "Do not let a slow non-critical dependency fail your Kubernetes liveness probe; degrade gracefully and shed non-essential load.",
      whyItMatters: "If your `/health/liveness` check verifies database connectivity and the database encounters a 5-second lock, Kubernetes kills all application pods simultaneously, causing a full cascading outage.",
      whenToUse: "Every microservice deployed to Kubernetes, Docker Swarm, or container orchestrators.",
      verdict: "Liveness probe: verifies only if process thread is alive (internal deadlock check). Readiness probe: verifies ability to accept traffic. Degrade non-critical features (recommendations, analytics) to keep core flows working."
    },
    keyTakeaways: [
      "Liveness probes should NEVER check downstream databases, caches, or third-party APIs.",
      "Readiness probes determine if the pod should receive traffic from the service load balancer.",
      "Implement graceful degradation: if recommendations service fails, return static fallbacks.",
      "Support Load Shedding: reject low-priority traffic with HTTP 503 before CPU saturates."
    ],
    scribble: {
      badge: "K8S PROBES & DEGRADATION",
      caption: "Distinction between internal liveness, network readiness, and feature degradation",
      diagramType: "flow",
      nodes: [
        { id: "k8s", label: "Kubernetes Kubelet", detail: "Probes every 10s", status: "accent" },
        { id: "liveness", label: "Liveness Probe", detail: "Checks process deadlock ONLY", status: "success", annotation: "Never check DB here!" },
        { id: "readiness", label: "Readiness Probe", detail: "Checks DB/Kafka connection", status: "warn", annotation: "Removes from Traffic" },
        { id: "pod", label: "App Service Pod", detail: "Serving live traffic", status: "normal" },
        { id: "degrade", label: "Degradation Fallback", detail: "Serve cached or static default", status: "success" }
      ],
      connections: [
        { from: "k8s", to: "liveness", label: "HTTP /health/live" },
        { from: "k8s", to: "readiness", label: "HTTP /health/ready" },
        { from: "readiness", to: "pod", label: "pass: route ingress traffic" },
        { from: "pod", to: "degrade", label: "recs fail -> return trending items", dashed: true }
      ]
    },
    article: {
      overview: "Kubernetes liveness and readiness probes are frequently misunderstood. A liveness probe tells Kubernetes when to kill and restart a container. If you check an external database inside your liveness probe and the database slows down, Kubernetes restarts all 50 pods at once, compounding the database connection storm and prolonging the outage.",
      antiPattern: {
        title: "Anti-Pattern: Database Check in Liveness Probe",
        description: "Configuring the liveness probe to verify database connectivity. When the database is overloaded, Kubernetes reboots all pods simultaneously.",
        codeSnippet: `// ❌ ANTI-PATTERN: Fatal Kubernetes Misconfiguration
// deployment.yaml
livenessProbe:
  httpGet:
    path: /actuator/health # ❌ Verifies DB, Redis, RabbitMQ!
    port: 8080
# When DB hits connection limits, K8s kills all pods, guaranteeing total downtime!`,
        language: "yaml"
      },
      productionPattern: {
        title: "Production Pattern: Separated Liveness vs Readiness & Fallbacks",
        description: "Configure Spring Boot Actuator's dedicated `/health/liveness` and `/health/readiness` endpoints with explicit probe groupings.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Separated K8s Probes
// application.yml
management:
  endpoint:
    health:
      probes:
        enabled: true
  health:
    livenessstate:
      enabled: true # Checks only internal JVM health
    readinessstate:
      enabled: true # Verifies DB, Redis connection pool

// deployment.yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 20
  periodSeconds: 5

// Graceful Degradation in code:
public List<ProductDto> getRecommendations(String userId) {
    try {
        return recommendationClient.getPersonalized(userId);
    } catch (Exception ex) {
        log.warn("Recommendation service degraded. Serving fallback trending products.");
        return staticFallbackCatalog.getTopTrending(); // Core checkout remains functional!
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Restarting Pod vs Removing from Ingress",
          pros: "Readiness failure stops new traffic without incurring the CPU cost of a JVM cold restart.",
          cons: "If a pod never recovers readiness, it sits idle until manually terminated.",
          recommendation: "Use readiness for dependencies; use liveness strictly for internal thread death."
        },
        {
          aspect: "Load Shedding",
          pros: "Dropping 10% of non-critical traffic allows the service to sustain the remaining 90%.",
          cons: "Requires identifying non-critical endpoints and returning HTTP 503 early.",
          recommendation: "Implement a servlet filter checking CPU or concurrency limits to reject traffic before OOM."
        }
      ],
      checklist: [
        "Does the liveness probe check ONLY internal process responsiveness (zero external dependencies)?",
        "Does the readiness probe verify database and message broker availability?",
        "Are non-essential features (recommendations, badges) wrapped in fallback handlers?",
        "Is graceful shutdown enabled (`server.shutdown=graceful`) to allow in-flight requests to complete?"
      ]
    }
  },
  {
    id: "configuration-and-feature-flags",
    slug: "configuration-and-feature-flags",
    title: "Configuration and Feature Flags",
    shortTitle: "Dynamic Feature Flags & Rollouts",
    category: "Ops, Config & Security",
    categoryColor: "rose",
    difficulty: "ESSENTIAL",
    readTimeMinutes: 7,
    tags: ["Feature Flags", "Canary Rollout", "Kill Switch", "Dark Launch", "LaunchDarkly"],
    summary: {
      rule: "Decouple code deployment from feature release using dynamic feature flags with automated kill switches.",
      whyItMatters: "Deploying new code straight to 100% of users without flags means any bug requires an emergency rollback, re-building images, and re-deploying.",
      whenToUse: "Major architectural migrations, checkout redesigns, new payment gateways, and algorithmic changes.",
      verdict: "Use percentage-based canary rollouts (1% -> 5% -> 25% -> 100%), test in production with dark launches, and instrument emergency kill switches that update in < 5 seconds without redeploying."
    },
    keyTakeaways: [
      "Deploy code dark (feature disabled) to test database queries and background load first.",
      "Roll out incrementally by user ID hash to ensure consistent user experience.",
      "Always design a fallback path when the flag is toggled OFF (kill switch).",
      "Delete obsolete feature flags within 30 days of 100% rollout to prevent tech debt."
    ],
    scribble: {
      badge: "CANARY FEATURE ROLLOUT",
      caption: "Percentage-based deterministic hashing evaluation with instant kill switch",
      diagramType: "flow",
      nodes: [
        { id: "req", label: "User Request", detail: "User ID: 94821", status: "normal" },
        { id: "eval", label: "Flag Evaluator", detail: "hash(userId + flagKey) % 100", status: "accent" },
        { id: "variant_a", label: "New V2 Algorithm", detail: "Bucket < 10% (Canary)", status: "success", annotation: "10% Rollout" },
        { id: "variant_b", label: "Legacy V1 Algorithm", detail: "Bucket >= 10% (Stable)", status: "normal" },
        { id: "kill_switch", label: "Emergency Kill Switch", detail: "Instant OFF in < 2s without deploy", status: "danger", annotation: "Kill Switch" }
      ],
      connections: [
        { from: "req", to: "eval", label: "evaluate flag" },
        { from: "eval", to: "variant_a", label: "user in canary bucket" },
        { from: "eval", to: "variant_b", label: "default user" },
        { from: "kill_switch", to: "variant_b", label: "override on anomaly", highlight: true }
      ]
    },
    article: {
      overview: "Continuous Delivery relies on small, frequent deployments. Feature flags separate the risk of deploying code from the risk of turning on business features. By dark launching features and routing 1% of traffic through them, engineers detect performance regressions before users notice.",
      antiPattern: {
        title: "Anti-Pattern: Big Bang Releases Without Rollback Toggles",
        description: "Flipping a massive new checkout engine to 100% of global users at midnight with no kill switch.",
        codeSnippet: `// ❌ ANTI-PATTERN: All or nothing
public CheckoutResponse checkout(Order order) {
    // If new checkout has a hidden deadlock, rolling back takes 30 minutes of CI/CD!
    return newCheckoutEngineV2.execute(order);
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Deterministic Canary Evaluation with Fallback",
        description: "Evaluate user cohorts deterministically based on user ID hashing, backed by an in-memory configuration provider.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Deterministic Canary Evaluation
@Service
public class CheckoutService {

    private final FeatureFlagService flagService;
    private final CheckoutEngineV1 legacyEngine;
    private final CheckoutEngineV2 newEngine;

    public CheckoutResponse checkout(User user, Order order) {
        // Flag evaluated in-memory (< 1ms)
        boolean isV2Enabled = flagService.isFeatureEnabled(
            "new-checkout-v2", 
            user.getId(), 
            false // Default fallback if flag provider unreachable
        );

        if (isV2Enabled) {
            try {
                return newEngine.execute(order);
            } catch (Exception ex) {
                log.error("Canary V2 failed for user={}. Activating local fallback.", user.getId(), ex);
                metrics.increment("checkout.v2.error");
                return legacyEngine.execute(order); // Safe local fallback
            }
        }

        return legacyEngine.execute(order);
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "In-Memory Polling vs Real-Time WebSocket Flags",
          pros: "In-memory caching evaluates in nanoseconds without network latency on critical paths.",
          cons: "Takes 1-5 seconds for flag changes to propagate to all pods.",
          recommendation: "Use local in-memory evaluation with background polling (e.g. Unleash / LaunchDarkly SDK)."
        },
        {
          aspect: "Flag Tech Debt",
          pros: "Total safety during rollout.",
          cons: "Dozens of nested `if/else` flag checks make code unreadable over time.",
          recommendation: "Treat flag removal as a mandatory sprint ticket as soon as a feature reaches 100% stable rollout."
        }
      ],
      checklist: [
        "Does the feature flag evaluate in memory without making synchronous HTTP calls in the request path?",
        "Is there an immediate kill switch to revert to legacy logic in seconds?",
        "Is canary hashing deterministic (the same user always gets the same variant)?",
        "Is there a ticket scheduled to delete the feature flag after full rollout?"
      ]
    }
  },
  {
    id: "metrics-and-alerting",
    slug: "metrics-and-alerting",
    title: "Metrics and Alerting (USE & RED Methods)",
    shortTitle: "Metrics, RED Method & Alerting",
    category: "Observability & Logging",
    categoryColor: "blue",
    difficulty: "CRITICAL",
    readTimeMinutes: 8,
    tags: ["Prometheus", "Grafana", "RED Method", "SLO / SLI", "PagerDuty Alert Fatigue"],
    summary: {
      rule: "Structure service metrics using the RED method (Rate, Errors, Duration) and alert on symptoms that impact users (SLO burn rate), not raw CPU spikes.",
      whyItMatters: "Alert fatigue causes on-call engineers to ignore alarms. Waking up an engineer because CPU hit 85% on a batch worker is noise; alerting because checkout 5xx rate crossed 1% saves revenue.",
      whenToUse: "Every production service, API gateway, database, and background consumer.",
      verdict: "Instrument the RED method (req/sec, 5xx error rate, p95/p99 latency) on every API endpoint. Route alerts to PagerDuty only when customer-facing SLOs are breached."
    },
    keyTakeaways: [
      "RED method: Rate (requests/sec), Errors (failed requests/sec), Duration (p95/p99 latency).",
      "USE method for infrastructure: Utilization (% busy), Saturation (queue depth), Errors.",
      "Never alert on single point-in-time spikes; use 5-minute rolling averages or multi-window burn rates.",
      "Every PagerDuty alert must have a linked Runbook detailing remediation steps."
    ],
    scribble: {
      badge: "THE RED METHOD & ALERTING",
      caption: "Telemetry flow: App Prometheus metrics -> Grafana dashboards -> Actionable SLO alerts",
      diagramType: "flow",
      nodes: [
        { id: "app", label: "Application Traffic", detail: "HTTP Endpoints & Workers", status: "normal" },
        { id: "red", label: "RED Telemetry", detail: "Rate, 5xx Errors, p99 Latency", status: "accent" },
        { id: "prom", label: "Prometheus TSDB", detail: "Scrapes /metrics every 15s", status: "normal" },
        { id: "slo", label: "SLO Rule Evaluator", detail: "99.9% availability error budget", status: "warn", annotation: "Multi-Window Burn" },
        { id: "pager", label: "PagerDuty (On-Call)", detail: "Actionable alert + Runbook link", status: "danger", annotation: "Page ONLY on impact" }
      ],
      connections: [
        { from: "app", to: "red", label: "Micrometer metrics" },
        { from: "red", to: "prom", label: "pull scrape" },
        { from: "prom", to: "slo", label: "evaluate burn rate" },
        { from: "slo", to: "pager", label: "SLO budget exhausted!", highlight: true }
      ]
    },
    article: {
      overview: "Observability is not about collecting billions of useless numbers; it is about detecting real customer degradation before users complain on Twitter. The RED method provides a universal mental model for request-driven architectures, while SLO-based alerting prevents on-call burnout.",
      antiPattern: {
        title: "Anti-Pattern: CPU-Threshold Alerts and Missing Latency Percentiles",
        description: "Alerting engineers whenever CPU crosses 80%, or measuring only average latency (which masks the worst 5% of customer experiences).",
        codeSnippet: `// ❌ ANTI-PATTERN: Alerting on CPU & average latency
# Alert rule:
alert: HighCPUUsage
expr: container_cpu_usage_percent > 80
for: 1m
# Fires every time a harmless batch job runs, waking engineers at 3 AM!
# Meanwhile, p99 latency spikes to 12s on checkout, but average is 200ms -> Zero alerts!`,
        language: "yaml"
      },
      productionPattern: {
        title: "Production Pattern: RED Method with Latency Percentiles and SLO Alerts",
        description: "Track p95 and p99 percentiles using Prometheus histograms and alert on multi-window error budget burn rates.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Micrometer RED Metrics Instrumentation
@Configuration
public class MetricsConfig {

    @Bean
    public TimedAspect timedAspect(MeterRegistry registry) {
        return new TimedAspect(registry);
    }
}

@RestController
@RequestMapping("/orders")
public class OrderController {

    @PostMapping
    @Timed(
        value = "http.orders.checkout", 
        description = "RED metrics for order checkout",
        percentiles = {0.50, 0.95, 0.99}, // Measure p50, p95, p99
        histogram = true
    )
    public ResponseEntity<OrderDto> checkout(@RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(orderService.process(request));
    }
}

# Prometheus Alerting Rule (Multi-window Burn Rate)
- alert: CheckoutErrorBudgetBurning
  expr: (
      sum(rate(http_orders_checkout_seconds_count{status=~"5.."}[5m]))
      /
      sum(rate(http_orders_checkout_seconds_count[5m]))
    ) > 0.01
  for: 2m
  labels:
    severity: page
  annotations:
    summary: "Checkout 5xx error rate is > 1% (SLO breached)"
    runbook: "https://wiki.internal/ops/runbooks/checkout-5xx"`,
        language: "yaml"
      },
      tradeoffs: [
        {
          aspect: "Average Latency vs p99 Latency",
          pros: "Average is easy to compute and understand.",
          cons: "Average hides catastrophic tail latency where high-value enterprise users wait 15 seconds.",
          recommendation: "Always monitor and alert on p95 and p99 percentiles."
        },
        {
          aspect: "Metric Cardinality",
          pros: "Adding tags like `user_id` gives granular diagnostics.",
          cons: "High cardinality tags (millions of unique user IDs) will crash Prometheus with out-of-memory errors.",
          recommendation: "Never put user IDs, order IDs, or raw emails into Prometheus metric tags."
        }
      ],
      checklist: [
        "Are all HTTP endpoints instrumented for Rate, Error Rate, and Duration (p95/p99)?",
        "Does every paging alert represent direct customer degradation?",
        "Does every alert notification include a direct link to an actionable runbook?",
        "Are metric tags strictly low-cardinality (status code, HTTP method, region)?"
      ]
    }
  },
  {
    id: "document-api-contracts",
    slug: "document-api-contracts",
    title: "Document API Contracts & Versioning",
    shortTitle: "API Contracts & OpenAPI Specs",
    category: "API Contracts & Errors",
    categoryColor: "purple",
    difficulty: "ESSENTIAL",
    readTimeMinutes: 7,
    tags: ["OpenAPI 3.1", "Swagger", "Contract-First", "Backward Compatibility", "SemVer"],
    summary: {
      rule: "Treat APIs as immutable public contracts; maintain authoritative OpenAPI specifications and enforce strict backward compatibility.",
      whyItMatters: "Renaming a field or changing a data type in an undocumented API silently breaks mobile apps and partner integrations, requiring emergency rollbacks.",
      whenToUse: "All external and internal REST/gRPC interfaces.",
      verdict: "Use OpenAPI 3.1 / Swagger as the single source of truth. Apply additive changes only (never remove or rename existing fields). Use URL path versioning (`/v1`, `/v2`) for breaking paradigm shifts."
    },
    keyTakeaways: [
      "OpenAPI spec is the contract: generate client SDKs, server stubs, and mock servers from it.",
      "Additive changes are safe: adding an optional field does not break existing clients.",
      "Renaming or removing a field is a breaking change; deprecate for 6-12 months before deletion.",
      "Enforce automated contract compatibility checks in CI (e.g. `oasdiff` or Spectral)."
    ],
    scribble: {
      badge: "CONTRACT-FIRST LIFECYCLE",
      caption: "OpenAPI single source of truth generating server stubs, SDKs, and CI breaking checks",
      diagramType: "flow",
      nodes: [
        { id: "spec", label: "OpenAPI 3.1 Spec", detail: "openapi.yaml in git", status: "accent", annotation: "Source of Truth" },
        { id: "ci_diff", label: "CI Breaking Check", detail: "oasdiff detects breaking changes", status: "danger", annotation: "Block PR if breaking" },
        { id: "server", label: "Server Stubs", detail: "Generated Java/TS interfaces", status: "success" },
        { id: "sdk", label: "Client SDKs", detail: "iOS, Android & Frontend clients", status: "success" },
        { id: "docs", label: "Interactive Docs", detail: "Swagger UI / Redoc", status: "normal" }
      ],
      connections: [
        { from: "spec", to: "ci_diff", label: "git push" },
        { from: "spec", to: "server", label: "code-gen" },
        { from: "spec", to: "sdk", label: "code-gen" },
        { from: "spec", to: "docs", label: "render" }
      ]
    },
    article: {
      overview: "An API is a binding promise to consumers. Mobile clients cannot be forced to update immediately; users may run older app versions for years. Writing and validating API contracts using OpenAPI ensures seamless cross-team communication and prevents surprise breaking changes.",
      antiPattern: {
        title: "Anti-Pattern: Silent Breaking Changes in Unversioned Endpoints",
        description: "Renaming `customer_id` to `userId` or changing an integer timestamp to an ISO string without versioning.",
        codeSnippet: `// ❌ ANTI-PATTERN: Breaks all existing mobile clients on deploy!
// Yesterday: { "orderId": "101", "createdTimestamp": 1718900000 }
// Today:
public record OrderResponse(
    String id, // ❌ Renamed from orderId! Mobile app crashes on null pointer!
    Instant createdAt // ❌ Changed data type from long to string!
) {}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Additive-Only Evolution & OpenAPI Annotations",
        description: "Keep existing fields intact, add new fields as optional, and document schemas with clear OpenAPI definitions.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Additive Schema Evolution & OpenAPI
@Schema(description = "Customer order response model")
public record OrderResponse(
    @Schema(description = "Unique order identifier", example = "ord_8f9a2b")
    String orderId,

    @Schema(description = "Total amount in cents", example = "4999")
    long amountCents,

    @Deprecated
    @Schema(description = "Legacy epoch timestamp (use createdAtUtc instead)", deprecated = true)
    Long createdTimestamp,

    // Additive non-breaking new field:
    @Schema(description = "ISO-8601 formatted creation timestamp", example = "2026-10-23T12:00:00Z")
    Instant createdAtUtc
) {}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "URL Path Versioning vs Header Versioning",
          pros: "URL path (`/v1/orders` -> `/v2/orders`) is explicitly visible in browser bars and CDN caching.",
          cons: "Header versioning (`Accept: application/vnd.company.v2+json`) keeps clean URLs.",
          recommendation: "Use URL path versioning (`/v1/`) for simplicity and transparent CDN cache separation."
        },
        {
          aspect: "Contract-First vs Code-First",
          pros: "Contract-first allows frontend and mobile teams to mock APIs before backend writes a line of code.",
          cons: "Requires editing YAML/JSON specs manually or with visual tools.",
          recommendation: "Use Contract-First for public APIs; Code-First with SpringDoc for internal rapid microservices."
        }
      ],
      checklist: [
        "Is an interactive Swagger UI / Redoc available for all environments?",
        "Does the CI pipeline run `oasdiff` to block accidental breaking changes in PRs?",
        "Are deprecated fields kept functional for at least two version cycles before removal?",
        "Do all date/time fields strictly use ISO-8601 UTC strings?"
      ]
    }
  },
  {
    id: "configuration-keeping-12-factor",
    slug: "configuration-keeping-12-factor",
    title: "Configuration Keeping & 12-Factor Discipline",
    shortTitle: "12-Factor Configuration Keeping",
    category: "Ops, Config & Security",
    categoryColor: "rose",
    difficulty: "ESSENTIAL",
    readTimeMinutes: 6,
    tags: ["12-Factor App", "Environment Parity", "Config vs Code", "Docker", "Cloud Native"],
    summary: {
      rule: "Maintain strict separation between code and configuration; compile identical immutable container images and configure them via environment variables.",
      whyItMatters: "Building environment-specific binaries (`my-app-dev.jar` vs `my-app-prod.jar`) introduces untested configuration differences and violates modern container principles.",
      whenToUse: "Every microservice, backend app, and cloud-native container.",
      verdict: "Follow Factor III of the 12-Factor App: store config in the environment. The exact same Docker image must run in local, dev, staging, and production without rebuilding."
    },
    keyTakeaways: [
      "The exact same binary/container image must be deployed to Dev, Staging, and Production.",
      "All environment differences (DB URLs, third-party keys, thread counts) must come from environment variables.",
      "Never store credentials in config files committed to code repositories.",
      "Fail fast on application boot if required environment variables are missing."
    ],
    scribble: {
      badge: "12-FACTOR CONFIG DISCIPLINE",
      caption: "One immutable container artifact configured purely via environment injections",
      diagramType: "comparison",
      nodes: [
        { id: "image", label: "Immutable Image", detail: "beingsde/api:v2.4.0 (Identical everywhere)", status: "accent", annotation: "Build ONCE" },
        { id: "env_dev", label: "Dev Environment", detail: "ENV: DB_URL=dev.internal:5432", status: "normal" },
        { id: "env_stg", label: "Staging Environment", detail: "ENV: DB_URL=stg.internal:5432", status: "normal" },
        { id: "env_prod", label: "Production Cluster", detail: "ENV: DB_URL=prod-cluster:5432", status: "success", annotation: "Zero Rebuild" }
      ],
      connections: [
        { from: "image", to: "env_dev", label: "deploy" },
        { from: "image", to: "env_stg", label: "deploy" },
        { from: "image", to: "env_prod", label: "deploy" }
      ]
    },
    article: {
      overview: "The 12-Factor App methodology established that an application's configuration is everything that varies between deployment environments (credentials, database URLs, backing services). Code does not vary between environments; only configuration does.",
      antiPattern: {
        title: "Anti-Pattern: Hardcoded Environment Toggles and Separate Binaries",
        description: "Checking `if (env.equals(\"prod\"))` in business code or compiling separate builds for each environment.",
        codeSnippet: `// ❌ ANTI-PATTERN: Environment logic hardcoded in Java
if (System.getProperty("env").equals("prod")) {
    paymentUrl = "https://live.paypal.com";
} else {
    paymentUrl = "https://sandbox.paypal.com";
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Externalized Typed Configuration with Fail-Fast Validation",
        description: "Map environment variables to strongly-typed configuration classes with strict startup validation.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Strongly-Typed Environment Properties
@ConfigurationProperties(prefix = "payment.gateway")
@Validated
public record PaymentGatewayProperties(
    @NotBlank(message = "Payment gateway baseUrl must be specified via PAYMENT_GATEWAY_BASE_URL")
    String baseUrl,

    @NotBlank(message = "API key must be injected via PAYMENT_GATEWAY_API_KEY")
    String apiKey,

    @Min(value = 100, message = "Timeout must be at least 100ms")
    int timeoutMs
) {}

// application.yml (Default fallback references ENV)
payment:
  gateway:
    base-url: \${PAYMENT_GATEWAY_BASE_URL}
    api-key: \${PAYMENT_GATEWAY_API_KEY}
    timeout-ms: \${PAYMENT_GATEWAY_TIMEOUT_MS:2000}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Dotenv (.env) vs System Environment Variables",
          pros: "Dotenv files are convenient for local developer laptops.",
          cons: "Dotenv files can be accidentally committed to Git.",
          recommendation: "Use `.env` locally (strictly added to `.gitignore`); use real OS environment variables or K8s ConfigMaps in cloud clusters."
        },
        {
          aspect: "Default Values",
          pros: "Defaults allow services to boot in test environments with minimal setup.",
          cons: "Dangerous defaults (e.g. `localhost:5432`) can cause silent misconfigurations in staging.",
          recommendation: "Do not provide defaults for passwords or external URLs; fail fast if missing."
        }
      ],
      checklist: [
        "Is the exact same Docker container image deployed across Staging and Production?",
        "Are all database credentials and third-party URLs passed via environment variables?",
        "Does the application fail fast on startup if a required environment variable is missing?",
        "Are `.env` files strictly added to `.gitignore`?"
      ]
    }
  },
  {
    id: "error-messages-documentation",
    slug: "error-messages-documentation",
    title: "Error Messages & Standardized Error Envelopes",
    shortTitle: "Standardized Error Envelopes (RFC 7807)",
    category: "API Contracts & Errors",
    categoryColor: "purple",
    difficulty: "ESSENTIAL",
    readTimeMinutes: 7,
    tags: ["RFC 7807", "Problem Details", "Error Envelopes", "Security Leaks", "HTTP Status"],
    summary: {
      rule: "Return consistent, structured error envelopes (RFC 7807 Problem Details); never leak raw stack traces or SQL exceptions to API clients.",
      whyItMatters: "Raw stack traces expose internal class names, database schemas, and library versions to attackers, while inconsistent error shapes break frontend error handling.",
      whenToUse: "Every REST, GraphQL, and webhook API response for 4xx and 5xx status codes.",
      verdict: "Standardize on RFC 7807: include `type`, `title`, `status`, `detail`, `instance`, and an opaque `error_id` (trace ID) so users can report issues without seeing raw code internals."
    },
    keyTakeaways: [
      "Adopt RFC 7807 'Problem Details for HTTP APIs' across all services.",
      "Always attach an `error_id` / `trace_id` so frontend users can quote it to customer support.",
      "Never leak SQL syntax errors, database passwords, or full Java stack traces to API clients.",
      "Distinguish client errors (4xx - invalid input) from internal system defects (5xx - server crash)."
    ],
    scribble: {
      badge: "RFC 7807 ERROR ENVELOPE",
      caption: "Standardized error payload protecting internal stack traces while providing client clarity",
      diagramType: "comparison",
      nodes: [
        { id: "bad_err", label: "❌ RAW EXCEPTION LEAK", detail: "HTTP 500: PSQLException: relation 'users' does not exist at org.postgresql.core...", status: "danger", annotation: "Security Leak!" },
        { id: "good_err", label: "✅ RFC 7807 PROBLEM DETAILS", detail: "{ status: 422, title: 'Unprocessable Entity', detail: 'Insufficient stock', error_id: 'err_8f9a' }", status: "success", annotation: "Clean & Actionable" },
        { id: "support", label: "Customer Support / Triage", detail: "Look up error_id in Loki/Elasticsearch", status: "accent" }
      ],
      connections: [
        { from: "bad_err", to: "good_err", label: "sanitize via @ControllerAdvice" },
        { from: "good_err", to: "support", label: "quote error_id" }
      ]
    },
    article: {
      overview: "When an API call fails, the client needs to know two things: What went wrong? How can I fix it? Returning inconsistent string messages like `\"Something broke\"` on one endpoint and an HTML stack trace on another creates a frustrating developer experience and leaks attack vectors.",
      antiPattern: {
        title: "Anti-Pattern: Default Framework Error Pages & Leaked Stack Traces",
        description: "Allowing uncaught exceptions to bubble up to Tomcat or Express, returning raw database traces to the browser.",
        codeSnippet: `// ❌ ANTI-PATTERN: Leaks database table names and credentials
HTTP/1.1 500 Internal Server Error
Content-Type: text/plain

org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "users_email_key"
  Detail: Key (email)=(john@example.com) already exists.
  at org.hibernate.exception.internal.SQLStateConverter...`,
        language: "http"
      },
      productionPattern: {
        title: "Production Pattern: RFC 7807 ProblemDetail Global Handler",
        description: "Use Spring's native `ProblemDetail` or custom RFC 7807 envelope with sanitized client messages and an opaque trace ID.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: RFC 7807 Global Exception Handling
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(InsufficientInventoryException.class)
    public ProblemDetail handleInventoryError(InsufficientInventoryException ex, HttpServletRequest req) {
        String errorId = MDC.get("traceId");
        
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.UNPROCESSABLE_ENTITY, 
            ex.getMessage() // Safe domain message: "Only 2 items remain in stock."
        );
        problem.setTitle("Inventory Shortage");
        problem.setType(URI.create("https://beingsde.in/errors/insufficient-inventory"));
        problem.setInstance(URI.create(req.getRequestURI()));
        problem.setProperty("error_id", errorId);
        problem.setProperty("available_quantity", ex.getAvailableQuantity());
        problem.setProperty("timestamp", Instant.now());
        
        return problem;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnexpectedCrash(Exception ex, HttpServletRequest req) {
        String errorId = UUID.randomUUID().toString().substring(0, 8);
        log.error("Unhandled internal server crash: error_id={}", errorId, ex);
        
        // NEVER leak ex.getMessage() for unexpected 500s!
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "An unexpected server error occurred. Please quote error_id to support."
        );
        problem.setTitle("Internal Server Error");
        problem.setProperty("error_id", errorId);
        return problem;
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Custom JSON vs RFC 7807 Problem Details",
          pros: "RFC 7807 is an open IETF internet standard natively supported by modern frameworks.",
          cons: "Requires migrating legacy frontend parsers to expect the standard schema.",
          recommendation: "Adopt RFC 7807 for all new microservices; it is standard in Spring Boot 3+ and .NET 7+."
        },
        {
          aspect: "Developer Details in Staging vs Prod",
          pros: "Showing stack traces in local dev speeds up debugging.",
          cons: "Accidentally leaving dev mode on in production causes security breaches.",
          recommendation: "Completely disable stack trace inclusion in HTTP responses at the build/profile level."
        }
      ],
      checklist: [
        "Do all 4xx and 5xx responses return standard JSON (RFC 7807)?",
        "Does every error response contain an opaque `error_id` or `trace_id`?",
        "Are raw stack traces and SQL exception messages completely blocked from response bodies?",
        "Are field-level validation errors formatted as an array of property-name + reason objects?"
      ]
    }
  },
  {
    id: "custom-event-orchestration",
    slug: "custom-event-orchestration",
    title: "Custom Event Orchestration & Schemas",
    shortTitle: "Custom Event Orchestration",
    category: "Data & State Consistency",
    categoryColor: "purple",
    difficulty: "CRITICAL",
    readTimeMinutes: 8,
    tags: ["Event-Driven", "CloudEvents", "Avro / Protobuf", "Schema Registry", "Pub/Sub"],
    summary: {
      rule: "Wrap all asynchronous messages in standardized Event Envelopes with strict schema versioning and deterministic event IDs.",
      whyItMatters: "Publishing unstructured raw JSON payloads across queues leads to breaking contract changes, inability to replay events, and un-debuggable consumer crashes.",
      whenToUse: "Event-driven microservices, Kafka topics, RabbitMQ exchanges, and webhook pipelines.",
      verdict: "Standardize on an Event Envelope (e.g. CloudEvents standard: `id`, `source`, `type`, `time`, `data_version`, `payload`). Enforce schema evolution with Avro or JSON Schema Registry."
    },
    keyTakeaways: [
      "Standardize on an immutable Event Envelope across all services.",
      "Assign a unique, deterministic `event_id` (UUIDv4) to enable consumer deduplication.",
      "Include semantic event names with domain context (e.g., `billing.subscription.charged.v1`).",
      "Enforce backward compatibility using a Schema Registry (Confluent Avro / Protobuf)."
    ],
    scribble: {
      badge: "EVENT ENVELOPE TOPOLOGY",
      caption: "Standardized CloudEvents envelope wrapping domain payload with schema validation",
      diagramType: "flow",
      nodes: [
        { id: "domain", label: "Domain Action", detail: "Order Placed", status: "normal" },
        { id: "envelope", label: "Event Envelope", detail: "id, source, type, timestamp, traceId", status: "accent", annotation: "CloudEvents Spec" },
        { id: "registry", label: "Schema Registry", detail: "Validates backward compatibility", status: "warn" },
        { id: "kafka", label: "Kafka Event Stream", detail: "orders.events.v1", status: "success" },
        { id: "consumer", label: "Idempotent Consumer", detail: "Deduplicates via event_id", status: "normal" }
      ],
      connections: [
        { from: "domain", to: "envelope", label: "wrap payload" },
        { from: "envelope", to: "registry", label: "verify schema" },
        { from: "registry", to: "kafka", label: "publish" },
        { from: "kafka", to: "consumer", label: "deduplicate & process" }
      ]
    },
    article: {
      overview: "In an event-driven architecture, events are public API contracts. If a service publishes an unstructured JSON string, consumers have no way of knowing what fields are mandatory, what version of the schema is being sent, or how to deduplicate repeated messages.",
      antiPattern: {
        title: "Anti-Pattern: Raw Naked JSON Payloads",
        description: "Publishing a naked JSON entity directly onto a message bus without metadata or version indicators.",
        codeSnippet: `// ❌ ANTI-PATTERN: Naked JSON with zero metadata
// What service sent this? When? What schema version? What is the traceId?
{
  "orderId": 104,
  "status": "PAID"
}`,
        language: "json"
      },
      productionPattern: {
        title: "Production Pattern: CloudEvents-Compliant Generic Envelope",
        description: "Wrap business payloads in a structured envelope containing event metadata, trace context, and schema versions.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Standardized Event Envelope
public record EventEnvelope<T>(
    String eventId,        // Unique UUID for consumer deduplication
    String eventType,      // e.g., "orders.order-placed.v1"
    String source,         // Microservice name: "order-service"
    Instant timestamp,     // UTC instant when event occurred
    String traceId,        // Distributed trace identifier
    String schemaVersion,  // e.g., "1.2.0"
    T payload              // Strongly-typed business data
) {
    public static <T> EventEnvelope<T> of(String eventType, String source, T payload) {
        return new EventEnvelope<>(
            UUID.randomUUID().toString(),
            eventType,
            source,
            Instant.now(),
            MDC.get("traceId"),
            "1.0.0",
            payload
        );
    }
}

// Consumer Deduplication
public void onEvent(EventEnvelope<OrderPlacedData> envelope) {
    // Atomic check against Redis or DB deduplication table
    if (!deduplicationService.tryAcquire(envelope.eventId())) {
        log.info("Duplicate event ignored: id={}", envelope.eventId());
        return;
    }
    processOrder(envelope.payload());
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "JSON vs Avro/Protobuf Binary",
          pros: "JSON is human-readable and easy to inspect in CLI tools.",
          cons: "JSON is 5x larger over the network and lacks strict compile-time schema contracts.",
          recommendation: "Use JSON with envelopes for low-to-medium throughput; adopt Avro with Confluent Schema Registry for > 10,000 events/sec."
        },
        {
          aspect: "Fat Events vs Thin Notification Events",
          pros: "Fat events (full entity state) allow consumers to act without calling back to the producer DB.",
          cons: "Fat events consume more bandwidth and increase coupling.",
          recommendation: "Use Fat Events with immutable snapshots for audit and analytics; use Thin Events for cache invalidations."
        }
      ],
      checklist: [
        "Do all published events carry an immutable `event_id` and UTC `timestamp`?",
        "Does the envelope propagate `trace_id` for end-to-end distributed tracing?",
        "Are consumers deduplicating messages using the unique `event_id`?",
        "Is there a formal schema compatibility policy (backward/forward) enforced in CI?"
      ]
    }
  },
  {
    id: "database-query-optimization",
    slug: "database-query-optimization",
    title: "Database Query Optimization & Indexes",
    shortTitle: "Query Optimization & B-Tree Indexes",
    category: "Database & Performance",
    categoryColor: "amber",
    difficulty: "CRITICAL",
    readTimeMinutes: 9,
    tags: ["EXPLAIN ANALYZE", "B-Tree Index", "Composite Index", "N+1 Problem", "Keyset Pagination"],
    summary: {
      rule: "Never release a database query without running `EXPLAIN ANALYZE`; eliminate N+1 queries and replace offset pagination with keyset pagination.",
      whyItMatters: "Unindexed full table scans lock CPU cores, while offset pagination (`OFFSET 1000000`) forces the database to read and discard a million rows on every click.",
      whenToUse: "Every relational database query (PostgreSQL, MySQL, CockroachDB).",
      verdict: "Index columns in foreign keys and `WHERE`/`ORDER BY` clauses following the Leftmost Prefix Rule. Use `JOIN FETCH` to eliminate N+1 queries and keyset pagination (`WHERE id > :lastId`) for large datasets."
    },
    keyTakeaways: [
      "Always inspect `EXPLAIN (ANALYZE, BUFFERS)`: look for Seq Scans on large tables.",
      "Composite index column order matters: Equality columns first, Range/Sort columns last.",
      "Eliminate N+1 queries with eager `JOIN FETCH` or batch loading (`@BatchSize(size = 50)`).",
      "Avoid `OFFSET 50000`; use Keyset Cursor Pagination (`WHERE (created_at, id) < (:lastDate, :lastId)`)."
    ],
    scribble: {
      badge: "INDEX OPTIMIZATION ANATOMY",
      caption: "Transforming slow Sequential Scans into sub-millisecond B-Tree Index Scans",
      diagramType: "comparison",
      nodes: [
        { id: "seq_scan", label: "❌ Seq Scan (10M Rows)", detail: "Execution: 4,820ms | CPU: 100%", status: "danger", annotation: "Disk I/O Bottleneck" },
        { id: "composite", label: "B-Tree Composite Index", detail: "CREATE INDEX idx_user_created ON orders (user_id, created_at DESC)", status: "accent" },
        { id: "index_scan", label: "✅ Index Scan (0.4ms)", detail: "Execution: 0.4ms | Zero Seq Scan", status: "success", annotation: "10,000x Faster" },
        { id: "n_plus_one", label: "N+1 Query Killer", detail: "JOIN FETCH / BatchSize = 50", status: "normal" }
      ],
      connections: [
        { from: "seq_scan", to: "composite", label: "add index based on EXPLAIN" },
        { from: "composite", to: "index_scan", label: "fast B-Tree lookup" },
        { from: "index_scan", to: "n_plus_one", label: "eager load associations" }
      ]
    },
    article: {
      overview: "90% of performance issues in software applications are caused by inefficient database queries. Adding more CPU or RAM to a database server is an expensive band-aid for queries performing unindexed sequential scans or executing 1,000 round-trip queries in an N+1 loop.",
      antiPattern: {
        title: "Anti-Pattern: The N+1 Query & Offset Pagination Trap",
        description: "Lazy-loading a collection in a loop produces 1 + N queries. Using `LIMIT 20 OFFSET 500000` scans and discards 500,000 rows.",
        codeSnippet: `// ❌ ANTI-PATTERN: N+1 queries + slow offset
List<Order> orders = orderRepo.findAll(); // 1 query
for (Order o : orders) { // 1,000 orders
    System.out.println(o.getCustomer().getName()); // 1,000 separate SELECT queries!
}

// ❌ SLOW OFFSET: Reads 1,000,020 rows off disk just to return 20!
SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 1000000;`,
        language: "sql"
      },
      productionPattern: {
        title: "Production Pattern: JOIN FETCH, Composite Indexes & Keyset Pagination",
        description: "Fetch associated entities in a single SQL query and paginate using seek/keyset filters on indexed columns.",
        codeSnippet: `// ✅ PRODUCTION PATTERN 1: Eliminating N+1 with JOIN FETCH
@Query("SELECT o FROM Order o JOIN FETCH o.customer WHERE o.status = :status")
List<Order> findOrdersWithCustomer(@Param("status") OrderStatus status);

// ✅ PRODUCTION PATTERN 2: Keyset (Cursor) Pagination in SQL
-- Index: CREATE INDEX idx_orders_cursor ON orders (created_at DESC, id DESC);
-- Sub-millisecond execution even on page 10,000:
SELECT id, amount, created_at 
FROM orders 
WHERE (created_at, id) < (:lastSeenCreatedAt, :lastSeenId)
ORDER BY created_at DESC, id DESC 
LIMIT 20;

// PostgreSQL EXPLAIN ANALYZE Verification
-- Look for 'Index Scan using idx_orders_cursor' and 'Rows Removed by Filter: 0'`,
        language: "sql"
      },
      tradeoffs: [
        {
          aspect: "Too Few vs Too Many Indexes",
          pros: "Indexes make SELECT queries 1,000x faster.",
          cons: "Every index slows down INSERT/UPDATE/DELETE operations and consumes RAM.",
          recommendation: "Only index columns queried with high frequency; audit and drop unused indexes quarterly."
        },
        {
          aspect: "Offset vs Keyset Pagination",
          pros: "Keyset pagination maintains constant O(1) time regardless of depth.",
          cons: "Cannot jump directly to 'Page 47' (infinite scroll / next-page only).",
          recommendation: "Use Keyset pagination for all feeds, activity logs, and large tables."
        }
      ],
      checklist: [
        "Has every new repository query been verified with `EXPLAIN (ANALYZE, BUFFERS)`?",
        "Are foreign key columns indexed to prevent table locks during cascades?",
        "Are ORM associations fetched using `JOIN FETCH` or `@EntityGraph` to eliminate N+1?",
        "Is deep pagination implemented using keyset/cursor filters rather than `OFFSET`?"
      ]
    }
  },
  {
    id: "exception-handling-patterns",
    slug: "exception-handling-patterns",
    title: "Clean Exception Handling Patterns",
    shortTitle: "Clean Exception Handling & Boundaries",
    category: "API Contracts & Errors",
    categoryColor: "purple",
    difficulty: "ESSENTIAL",
    readTimeMinutes: 7,
    tags: ["Exception Handling", "Domain Exceptions", "ControllerAdvice", "Anti-Pattern", "Clean Code"],
    summary: {
      rule: "Never catch `Exception` and silently swallow it; translate technical exceptions into rich domain exceptions at integration boundaries.",
      whyItMatters: "Swallowing exceptions (`catch (Exception e) {}`) hides corrupted state, makes bugs impossible to locate, and causes silent data loss.",
      whenToUse: "Across all application layers, third-party library integrations, and controllers.",
      verdict: "Catch specific exceptions, wrap in custom domain exceptions with context, preserve original cause (`throw new DomainEx('failed', cause)`), and handle globally via `@ControllerAdvice`."
    },
    keyTakeaways: [
      "Never catch `Throwable` or `Exception` without re-throwing or logging the stack trace.",
      "Always pass the original cause when wrapping exceptions: `new CustomException(msg, cause)`.",
      "Distinguish recoverable business exceptions from fatal system defects.",
      "Handle exceptions at architectural boundaries (API Controllers / Messaging Handlers), not in every 3rd line."
    ],
    scribble: {
      badge: "EXCEPTION TRANSLATION LADDER",
      caption: "Layered exception handling translating low-level driver errors into clean domain exceptions",
      diagramType: "flow",
      nodes: [
        { id: "driver", label: "Low-Level Driver", detail: "Throws PSQLException (Deadlock)", status: "danger" },
        { id: "adapter", label: "Integration Adapter", detail: "Catches & translates with cause", status: "accent" },
        { id: "domain", label: "Domain Service", detail: "Throws LockAcquisitionException", status: "warn", annotation: "Domain Context" },
        { id: "global", label: "Global @ControllerAdvice", detail: "Logs traceId & returns HTTP 409", status: "success", annotation: "Clean Boundary" }
      ],
      connections: [
        { from: "driver", to: "adapter", label: "raw driver error" },
        { from: "adapter", to: "domain", label: "wrap with cause" },
        { from: "domain", to: "global", label: "bubble up" },
        { from: "global", to: "driver", label: "log error with traceId", dashed: true }
      ]
    },
    article: {
      overview: "Exception handling is about managing failure gracefully without obscuring the root cause. Bad exception handling either swallows the error (leaving developers blind) or litters business logic with dozens of try/catch blocks that obscure the core algorithm.",
      antiPattern: {
        title: "Anti-Pattern: Swallowing Exceptions and Dropping Root Causes",
        description: "Empty catch blocks or catching an exception and throwing a new one without passing the original cause.",
        codeSnippet: `// ❌ ANTI-PATTERN 1: The Silent Killer
try {
    paymentService.charge(user, amount);
} catch (Exception e) {
    // Empty block! Payment failed, but program continues as if it succeeded!
}

// ❌ ANTI-PATTERN 2: Lost Stack Trace Cause
try {
    db.save(order);
} catch (SQLException e) {
    throw new RuntimeException("Database error"); // ❌ Dropped 'e'! Root cause is lost forever!
}`,
        language: "java"
      },
      productionPattern: {
        title: "Production Pattern: Domain Hierarchy with Preserved Cause & Global Handler",
        description: "Create a typed hierarchy of domain exceptions that preserve the underlying cause and map cleanly to HTTP status codes.",
        codeSnippet: `// ✅ PRODUCTION PATTERN: Domain Exception Hierarchy
public abstract class DomainException extends RuntimeException {
    protected DomainException(String message) { super(message); }
    protected DomainException(String message, Throwable cause) { super(message, cause); }
}

public class OrderNotFoundException extends DomainException {
    public OrderNotFoundException(String orderId) {
        super("Order not found with identifier: " + orderId);
    }
}

public class PaymentGatewayException extends DomainException {
    public PaymentGatewayException(String message, Throwable cause) {
        super(message, cause); // Always preserve cause!
    }
}

// Clean Domain Service (No try-catch clutter)
@Service
public class OrderService {
    public Order getOrder(String id) {
        return orderRepo.findById(id)
            .orElseThrow(() -> new OrderNotFoundException(id));
    }
}`,
        language: "java"
      },
      tradeoffs: [
        {
          aspect: "Checked vs Unchecked Exceptions",
          pros: "Checked exceptions force callers to consider failure cases at compile time.",
          cons: "Checked exceptions pollute method signatures throughout intermediate architectural layers.",
          recommendation: "Prefer unchecked (`RuntimeException`) domain exceptions; handle them centrally at boundaries."
        },
        {
          aspect: "Exceptions for Control Flow",
          pros: "None.",
          cons: "Constructing exceptions is slow because the JVM fills in the entire execution stack trace.",
          recommendation: "Never use exceptions for normal control flow (e.g. checking if a user exists); return `Optional<T>`."
        }
      ],
      checklist: [
        "Are there zero empty `catch` blocks in the entire codebase?",
        "When wrapping an exception, is the original exception passed as the `cause` argument?",
        "Are exceptions handled centrally via `@ControllerAdvice` rather than in individual controllers?",
        "Is `Optional<T>` used for expected missing values instead of throwing exceptions for normal lookups?"
      ]
    }
  },
  {
    id: "data-archival-policy",
    slug: "data-archival-policy",
    title: "Data Archival Policy & Lifecycle Management",
    shortTitle: "Data Archival & Retention Policy",
    category: "Database & Performance",
    categoryColor: "amber",
    difficulty: "CRITICAL",
    readTimeMinutes: 8,
    tags: ["Data Archival", "Table Partitioning", "S3 Glacier", "TTL", "GDPR Compliance"],
    summary: {
      rule: "Define automated data retention and archival policies from day one; tier old data from expensive NVMe tables into cold S3 storage.",
      whyItMatters: "A 5-year-old table with 500 million records causes slow backups, expensive cloud disks, sluggish indexes, and potential GDPR compliance fines.",
      whenToUse: "Audit logs, clickstream events, completed order history, telemetry metrics, and financial records.",
      verdict: "Partition large tables by date range (monthly/yearly), detach old partitions instantly without table locking, and offload to compressed Parquet files on S3 Glacier."
    },
    keyTakeaways: [
      "Table partitioning allows dropping/archiving a billion rows in 10 milliseconds via `ALTER TABLE DETACH PARTITION`.",
      "Tier data across Hot (NVMe PostgreSQL), Warm (S3 Parquet/Athena), and Cold (S3 Glacier Deep Archive).",
      "Automate data deletion for compliance (GDPR Right to Be Forgotten) using TTL workers.",
      "Keep transaction indexes lean by keeping active tables scoped to recent data (e.g. last 90 days)."
    ],
    scribble: {
      badge: "STORAGE TIERING LIFECYCLE",
      caption: "Tiering hot transactional data to warm S3 Parquet and cold Glacier archive",
      diagramType: "flow",
      nodes: [
        { id: "hot", label: "HOT: PostgreSQL NVMe", detail: "0 - 90 Days (Active OLTP)", status: "accent", annotation: "Sub-ms Queries" },
        { id: "detach", label: "Partition Rotation", detail: "ALTER TABLE DETACH PARTITION", status: "warn", annotation: "Instant (Zero Lock)" },
        { id: "warm", label: "WARM: S3 Iceberg/Parquet", detail: "90 - 365 Days (Athena/Analytics)", status: "success" },
        { id: "cold", label: "COLD: S3 Glacier", detail: "> 1 Year (Legal & Tax Compliance)", status: "normal", annotation: "$0.00099 / GB" }
      ],
      connections: [
        { from: "hot", to: "detach", label: "monthly cron" },
        { from: "detach", to: "warm", label: "export to Parquet" },
        { from: "warm", to: "cold", label: "S3 Lifecycle rule after 365d", dashed: true }
      ]
    },
    article: {
      overview: "Every successful system accumulates data. A database table that handles 50,000 orders a day will accumulate 18 million rows annually. If all historical data stays in the primary OLTP database, backups take 10 hours, VACUUM freezes disks, and indexes consume all available RAM. A structured archival policy keeps primary databases fast and lean.",
      antiPattern: {
        title: "Anti-Pattern: The Dangerous DELETE WHERE created_at < ... Query",
        description: "Running a massive `DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '1 year'` on a 100-million row table.",
        codeSnippet: `// ❌ ANTI-PATTERN: Blows up transaction logs and locks the table
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '365 days';
-- Generates millions of WAL records, locks rows, crashes replicas, and fragments disk space!`,
        language: "sql"
      },
      productionPattern: {
        title: "Production Pattern: Declarative Range Partitioning & S3 Export",
        description: "Partition tables by month. Detaching a partition is instantaneous (metadata operation), allowing painless archival to S3.",
        codeSnippet: `// ✅ PRODUCTION PATTERN 1: PostgreSQL Declarative Partitioning
CREATE TABLE audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    payload JSONB
) PARTITION BY RANGE (created_at);

-- Monthly partition tables:
CREATE TABLE audit_logs_2026_10 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');

CREATE TABLE audit_logs_2026_11 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');

// ✅ PRODUCTION PATTERN 2: Instant Detach & S3 Parquet Export
-- 1. Instantaneous metadata detach (Takes 2ms, zero table lock):
ALTER TABLE audit_logs DETACH PARTITION audit_logs_2025_10 CONCURRENTLY;

-- 2. Export detached partition to compressed Parquet on S3:
-- pg_dump or AWS DMS -> s3://company-archives/audit_logs/2025-10.parquet

-- 3. Drop detached partition table:
DROP TABLE audit_logs_2025_10;`,
        language: "sql"
      },
      tradeoffs: [
        {
          aspect: "Partition Detach vs Soft Deletion Flag",
          pros: "Detaching a partition reclaims 100% of physical disk space immediately.",
          cons: "Queries spanning multiple years must query multiple partition tables or warm storage.",
          recommendation: "Use Partitioning for append-heavy high-volume tables (logs, events, orders)."
        },
        {
          aspect: "S3 Glacier Retrieval Latency",
          pros: "S3 Glacier Deep Archive costs less than $1 per terabyte per month.",
          cons: "Retrieving archived files takes 3 to 12 hours.",
          recommendation: "Store data older than 1 year in Glacier if it is retained strictly for tax/legal compliance."
        }
      ],
      checklist: [
        "Are high-growth tables (> 10M rows/year) partitioned by date range?",
        "Is archival executed via partition detach rather than row-by-row `DELETE` queries?",
        "Are detached archives exported to compressed columnar formats (Parquet) on S3?",
        "Is there an automated S3 Lifecycle policy transitioning warm objects to Glacier after 365 days?"
      ]
    }
  }
];

export const CATEGORIES = [
  "All",
  "Resilience & Retries",
  "Data & State Consistency",
  "API Contracts & Errors",
  "Observability & Logging",
  "Ops, Config & Security",
  "Database & Performance"
] as const;
