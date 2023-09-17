package helpers

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJwtTokenRs256(username string, privKeyString string) (string, error) {
	claims := jwt.MapClaims{
		//"username": username,
		"exp":      time.Now().Add(time.Hour * 24 * 30).Unix(),
		"iat":      time.Now().Unix(),
		"sub":      username,
		//"iss":      "multiverse.cloud",
		//"aud":      []string{"multiverse.cloud"},
		//"jti":      "123456789",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)

	privKey, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(privKeyString))
	if err != nil {
		return "", fmt.Errorf("解析私钥错误: %w", err)
	}

	return token.SignedString(privKey)
}

func ParseJwtTokenRs256(tokenString string, pubKeyString string) (*jwt.RegisteredClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		pubKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(pubKeyString)) //解析公钥
		if err != nil {
			return nil, fmt.Errorf("ParseRSAPublicKeyFromPEM: %w", err)
		}
		return pubKey, nil
	})
	if err != nil {
		return nil, fmt.Errorf("token解析失败2: %w", err)
	}

	parsedClaims := &jwt.RegisteredClaims{}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		for key, value := range claims {
			if key == "sub" {
				if strValue, ok := value.(string); ok {
					parsedClaims.Subject = strValue
				}
			}
			if key == "iss" {
				if strValue, ok := value.(string); ok {
					parsedClaims.Issuer = strValue
				}
			}
			if key == "aud" {
				if audValue, ok := value.([]interface{}); ok {
					slice := make([]string, len(audValue))
					for i, v := range audValue {
						slice[i] = v.(string)
					}
					parsedClaims.Audience = slice
				}
			}
			if key == "exp" {
				if strValue, ok := value.(float64); ok {
					parsedClaims.ExpiresAt = jwt.NewNumericDate(time.Unix(int64(strValue), 0))

				}
			}
			if key == "nbf" {
				if strValue, ok := value.(float64); ok {
					parsedClaims.NotBefore = jwt.NewNumericDate(time.Unix(int64(strValue), 0))

				}
			}
			if key == "iat" {
				if strValue, ok := value.(float64); ok {
					parsedClaims.IssuedAt = jwt.NewNumericDate(time.Unix(int64(strValue), 0))

				}
			}
			if key == "jti" {
				if strValue, ok := value.(string); ok {
					parsedClaims.ID = strValue
				}
			}
		}
	}
	return parsedClaims, nil
}