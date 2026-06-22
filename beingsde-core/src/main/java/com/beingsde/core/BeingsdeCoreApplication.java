package com.beingsde.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class BeingsdeCoreApplication {

    public static void main(String[] args) {
        // Initialize Jasypt environment properties before bootstrapping Spring Context
        System.setProperty("jasypt.encryptor.password", "beingsdeMasterKey2026");
        System.setProperty("jasypt.encryptor.algorithm", "PBEWithMD5AndDES");
        
        SpringApplication.run(BeingsdeCoreApplication.class, args);
    }
}
