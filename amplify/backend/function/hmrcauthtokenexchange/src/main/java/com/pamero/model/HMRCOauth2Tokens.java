package com.pamero.model;

public class HMRCOauth2Tokens {

    String accessToken;
    String refreshToken;
    String grantedScope;
    Long expiresIn;

    public HMRCOauth2Tokens() {
    }

    public HMRCOauth2Tokens(String accessToken, String refreshToken, String grantedScope, Long expiresIn) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.grantedScope = grantedScope;
        this.expiresIn = expiresIn;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getGrantedScope() {
        return grantedScope;
    }

    public void setGrantedScope(String grantedScope) {
        this.grantedScope = grantedScope;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
}
