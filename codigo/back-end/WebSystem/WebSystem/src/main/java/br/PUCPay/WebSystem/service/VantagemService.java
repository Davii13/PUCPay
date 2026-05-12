package br.PUCPay.WebSystem.service;

import br.PUCPay.WebSystem.dao.VantagemDAO;
import br.PUCPay.WebSystem.model.Vantagem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VantagemService {

    @Autowired
    private VantagemDAO vantagemDAO;

    public Vantagem save(Vantagem vantagem) {
        return vantagemDAO.save(vantagem);
    }

    public Vantagem findById(Long id) {
        return vantagemDAO.findById(id);
    }

    public List<Vantagem> findAll() {
        return vantagemDAO.findAll();
    }

    public List<Vantagem> findByEmpresaId(Long empresaId) {
        return vantagemDAO.findByEmpresaId(empresaId);
    }

    public Vantagem update(Vantagem vantagem) {
        return vantagemDAO.update(vantagem);
    }

    public void delete(Long id) {
        vantagemDAO.delete(id);
    }
}
