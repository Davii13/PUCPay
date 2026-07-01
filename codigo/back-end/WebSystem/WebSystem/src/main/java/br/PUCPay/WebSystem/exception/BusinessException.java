package br.PUCPay.WebSystem.exception;

/**
 * Exceção para violações de regra de negócio (validação de entrada,
 * saldo insuficiente, entidade não encontrada, etc.).
 *
 * Substitui o uso de {@link RuntimeException} genérica na camada de
 * serviço, tornando explícito que o erro é causado pela requisição do
 * cliente (mapeada para HTTP 400) e não por uma falha interna do servidor.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
