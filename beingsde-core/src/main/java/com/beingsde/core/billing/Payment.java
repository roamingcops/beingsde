package com.beingsde.core.billing;

import java.time.Instant;

public class Payment {

    private String id;
    private String userId;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
    private long amountInPaise;
    private String currency;
    private String status;
    private String paymentMethod;
    private String invoicePdfUrl;
    private Instant createdAt;

    public Payment() {
    }

    public Payment(String id, String userId, String razorpayPaymentId, String razorpayOrderId, String razorpaySignature,
                   long amountInPaise, String currency, String status, String paymentMethod, String invoicePdfUrl,
                   Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpaySignature = razorpaySignature;
        this.amountInPaise = amountInPaise;
        this.currency = currency;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.invoicePdfUrl = invoicePdfUrl;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public String getRazorpaySignature() { return razorpaySignature; }
    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }
    public long getAmountInPaise() { return amountInPaise; }
    public void setAmountInPaise(long amountInPaise) { this.amountInPaise = amountInPaise; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getInvoicePdfUrl() { return invoicePdfUrl; }
    public void setInvoicePdfUrl(String invoicePdfUrl) { this.invoicePdfUrl = invoicePdfUrl; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static PaymentBuilder builder() {
        return new PaymentBuilder();
    }

    public static class PaymentBuilder {
        private String id;
        private String userId;
        private String razorpayPaymentId;
        private String razorpayOrderId;
        private String razorpaySignature;
        private long amountInPaise;
        private String currency;
        private String status;
        private String paymentMethod;
        private String invoicePdfUrl;
        private Instant createdAt;

        PaymentBuilder() {}

        public PaymentBuilder id(String id) { this.id = id; return this; }
        public PaymentBuilder userId(String userId) { this.userId = userId; return this; }
        public PaymentBuilder razorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; return this; }
        public PaymentBuilder razorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; return this; }
        public PaymentBuilder razorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; return this; }
        public PaymentBuilder amountInPaise(long amountInPaise) { this.amountInPaise = amountInPaise; return this; }
        public PaymentBuilder currency(String currency) { this.currency = currency; return this; }
        public PaymentBuilder status(String status) { this.status = status; return this; }
        public PaymentBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public PaymentBuilder invoicePdfUrl(String invoicePdfUrl) { this.invoicePdfUrl = invoicePdfUrl; return this; }
        public PaymentBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Payment build() {
            return new Payment(id, userId, razorpayPaymentId, razorpayOrderId, razorpaySignature, amountInPaise,
                    currency, status, paymentMethod, invoicePdfUrl, createdAt);
        }
    }
}
