package br.PUCPay.WebSystem.dao;

import java.util.List;

public interface GenericDAO<T> {
    T save(T entity);
    T findById(Long id);
    List<T> findAll();
    T update(T entity);
    void delete(Long id);
}
