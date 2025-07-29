<<<<<<< HEAD
package com.fmtali.genericapp.Repository;

import com.fmtali.genericapp.Models.Alerts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlertsRepository extends JpaRepository<Alerts, Long> {
    Page<Alerts> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Alerts> findByStatus(Alerts.Status status, Pageable pageable);
}
=======
package com.fmtali.genericapp.Repository;

import com.fmtali.genericapp.Models.Alerts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlertsRepository extends JpaRepository<Alerts, Long> {
    Page<Alerts> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Alerts> findByStatus(Alerts.Status status, Pageable pageable);
}
>>>>>>> af63beb568d4df441a8d9e84067552e15c4bb500
