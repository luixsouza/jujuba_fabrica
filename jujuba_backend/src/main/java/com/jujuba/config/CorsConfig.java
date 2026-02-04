package com.jujuba.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "cors")
@Getter
@Setter
public class CorsConfig {

    private Allowed allowed = new Allowed();

    @Getter
    @Setter
    public static class Allowed {
        private String origins = "http://localhost:3000";
    }
}
