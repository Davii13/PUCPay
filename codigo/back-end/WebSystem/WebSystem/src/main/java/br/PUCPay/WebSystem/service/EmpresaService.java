package br.PUCPay.WebSystem.service;

import br.PUCPay.WebSystem.dao.EmpresaDAO;
import br.PUCPay.WebSystem.model.Empresa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaDAO empresaDAO;

    public Empresa save(Empresa empresa) {
        return empresaDAO.save(empresa);
    }

    public Empresa findById(Long id) {
        return empresaDAO.findById(id);
    }

    public List<Empresa> findAll() {
        return empresaDAO.findAll();
    }

    public Empresa update(Empresa empresa) {
        return empresaDAO.update(empresa);
    }

    public void delete(Long id) {
        empresaDAO.delete(id);
    }
}
