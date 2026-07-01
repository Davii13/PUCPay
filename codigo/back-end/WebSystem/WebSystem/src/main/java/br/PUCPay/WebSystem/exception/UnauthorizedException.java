package br.PUCPay.WebSystem.exception;

/**
 * Exceção para falhas de autenticação (usuário inexistente, senha
 * incorreta). Mapeada para HTTP 401, preservando a semântica que o
 * AuthController expressava antes com o status 401 fixo no try/catch.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
