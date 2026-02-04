package com.jujuba.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtConfig {

    private String secret = "your-256-bit-secret-key-change-this-in-production-min-32-chars";

    private Expiration expiration = new Expiration();

    @Getter
    @Setter
    public static class Expiration {
        private long days = 0;
        private long hours = 2;
        private long minutes = 0;
    }
}
