package com.beingsde.core.config;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

public class JasyptEncryptorUtility {

    public static void main(String[] args) {
        StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        
        // Directly configure the password and algorithm on the encryptor
        encryptor.setPassword("beingsdeMasterKey2026");
        encryptor.setAlgorithm("PBEWithMD5AndDES"); 
        
        String plaintextMongoUri = "mongodb+srv://beingsde-dev:b2IqQ3Up2P4ktY8G@beingsde.b7s3tv2.mongodb.net/?appName=beingSDE";
        String encryptedMongoUri = encryptor.encrypt(plaintextMongoUri);

        System.out.println("=========================================");
        System.out.println("Plaintext URI: " + plaintextMongoUri);
        System.out.println("Encrypted URI: " + encryptedMongoUri);
        System.out.println("=========================================");
    }
}
