package com.beingsde.core.billing;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SupabaseBillingService {

    private final RestTemplate restTemplate;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    public SupabaseBillingService() {
        this.restTemplate = new RestTemplate();
    }

    public boolean isConfigured() {
        return supabaseUrl != null && 
               !supabaseUrl.isEmpty() && 
               !supabaseUrl.contains("placeholder") && 
               serviceRoleKey != null && 
               !serviceRoleKey.isEmpty() && 
               !"placeholder".equals(serviceRoleKey);
    }

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", serviceRoleKey);
        headers.set("Authorization", "Bearer " + serviceRoleKey);
        headers.set("Content-Type", "application/json");
        return headers;
    }

    public void savePayment(Payment payment) {
        if (!isConfigured()) return;

        try {
            String url = supabaseUrl + "/rest/v1/payments";
            HttpHeaders headers = getHeaders();
            headers.set("Prefer", "resolution=merge-duplicates");

            Map<String, Object> body = new HashMap<>();
            body.put("id", payment.getId());
            body.put("user_id", payment.getUserId());
            body.put("razorpay_payment_id", payment.getRazorpayPaymentId());
            body.put("razorpay_order_id", payment.getRazorpayOrderId());
            body.put("razorpay_signature", payment.getRazorpaySignature());
            body.put("amount_in_paise", payment.getAmountInPaise());
            body.put("currency", payment.getCurrency());
            body.put("status", payment.getStatus());
            body.put("payment_method", payment.getPaymentMethod());
            body.put("invoice_pdf_url", payment.getInvoicePdfUrl());
            body.put("created_at", payment.getCreatedAt() != null ? payment.getCreatedAt().toString() : Instant.now().toString());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(url, entity, String.class);
        } catch (Exception e) {
            System.err.println("Failed to save payment to Supabase: " + e.getMessage());
        }
    }

    public void saveSubscription(Subscription subscription) {
        if (!isConfigured()) return;

        try {
            String url = supabaseUrl + "/rest/v1/subscriptions";
            HttpHeaders headers = getHeaders();
            headers.set("Prefer", "resolution=merge-duplicates");

            Map<String, Object> body = new HashMap<>();
            body.put("id", subscription.getId());
            body.put("user_id", subscription.getUserId());
            body.put("tier", subscription.getTier());
            body.put("status", subscription.getStatus());
            body.put("razorpay_subscription_id", subscription.getRazorpaySubscriptionId());
            body.put("started_at", subscription.getStartedAt() != null ? subscription.getStartedAt().toString() : null);
            body.put("expires_at", subscription.getExpiresAt() != null ? subscription.getExpiresAt().toString() : null);
            body.put("auto_renew", subscription.isAutoRenew());
            body.put("created_at", subscription.getCreatedAt() != null ? subscription.getCreatedAt().toString() : Instant.now().toString());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(url, entity, String.class);
        } catch (Exception e) {
            System.err.println("Failed to save subscription to Supabase: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public List<Subscription> getSubscriptions(String userId) {
        List<Subscription> subscriptions = new ArrayList<>();
        if (!isConfigured()) return subscriptions;

        try {
            String url = supabaseUrl + "/rest/v1/subscriptions?user_id=eq." + userId + "&order=created_at.desc";
            HttpEntity<Void> entity = new HttpEntity<>(getHeaders());
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);

            if (response.getBody() != null) {
                for (Object item : response.getBody()) {
                    Map<String, Object> map = (Map<String, Object>) item;
                    subscriptions.add(mapToSubscription(map));
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to get subscriptions from Supabase: " + e.getMessage());
        }
        return subscriptions;
    }

    @SuppressWarnings("unchecked")
    public List<Payment> getPayments(String userId) {
        List<Payment> payments = new ArrayList<>();
        if (!isConfigured()) return payments;

        try {
            String url = supabaseUrl + "/rest/v1/payments?user_id=eq." + userId + "&order=created_at.desc";
            HttpEntity<Void> entity = new HttpEntity<>(getHeaders());
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);

            if (response.getBody() != null) {
                for (Object item : response.getBody()) {
                    Map<String, Object> map = (Map<String, Object>) item;
                    payments.add(mapToPayment(map));
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to get payments from Supabase: " + e.getMessage());
        }
        return payments;
    }

    public void updateSupabaseUserRole(String userId, String role) {
        if (!isConfigured()) return;

        try {
            String url = supabaseUrl + "/auth/v1/admin/users/" + userId;
            HttpHeaders headers = getHeaders();
            headers.set("apikey", serviceRoleKey);
            headers.set("Authorization", "Bearer " + serviceRoleKey);
            headers.set("Content-Type", "application/json");

            Map<String, Object> appMetadata = new HashMap<>();
            appMetadata.put("role", role);

            Map<String, Object> body = new HashMap<>();
            body.put("app_metadata", appMetadata);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);
        } catch (Exception e) {
            System.err.println("Failed to update user role in Supabase Auth: " + e.getMessage());
        }
    }

    private Subscription mapToSubscription(Map<String, Object> map) {
        Subscription sub = new Subscription();
        sub.setId((String) map.get("id"));
        sub.setUserId((String) map.get("user_id"));
        sub.setTier((String) map.get("tier"));
        sub.setStatus((String) map.get("status"));
        sub.setRazorpaySubscriptionId((String) map.get("razorpay_subscription_id"));
        
        String startedAt = (String) map.get("started_at");
        if (startedAt != null) sub.setStartedAt(Instant.parse(startedAt));
        
        String expiresAt = (String) map.get("expires_at");
        if (expiresAt != null) sub.setExpiresAt(Instant.parse(expiresAt));
        
        Boolean autoRenew = (Boolean) map.get("auto_renew");
        if (autoRenew != null) sub.setAutoRenew(autoRenew);
        
        String createdAt = (String) map.get("created_at");
        if (createdAt != null) sub.setCreatedAt(Instant.parse(createdAt));
        
        return sub;
    }

    private Payment mapToPayment(Map<String, Object> map) {
        Payment pay = new Payment();
        pay.setId((String) map.get("id"));
        pay.setUserId((String) map.get("user_id"));
        pay.setRazorpayPaymentId((String) map.get("razorpay_payment_id"));
        pay.setRazorpayOrderId((String) map.get("razorpay_order_id"));
        pay.setRazorpaySignature((String) map.get("razorpay_signature"));
        
        Number amount = (Number) map.get("amount_in_paise");
        if (amount != null) pay.setAmountInPaise(amount.longValue());
        
        pay.setCurrency((String) map.get("currency"));
        pay.setStatus((String) map.get("status"));
        pay.setPaymentMethod((String) map.get("payment_method"));
        pay.setInvoicePdfUrl((String) map.get("invoice_pdf_url"));
        
        String createdAt = (String) map.get("created_at");
        if (createdAt != null) pay.setCreatedAt(Instant.parse(createdAt));
        
        return pay;
    }
}
