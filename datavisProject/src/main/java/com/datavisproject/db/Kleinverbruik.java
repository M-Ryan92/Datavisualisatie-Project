package com.datavisproject.db;

import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "kleinverbruik")
@NamedQueries({
    @NamedQuery(name = "Kleinverbruik.findAll", query = "SELECT k FROM Kleinverbruik k")})
@XmlRootElement
public class Kleinverbruik implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Size(max = 4)
    @Column(name = "jaar")
    private String jaar;
    @Size(max = 255)
    @Column(name = "meetverantwoordelijke")
    private String meetverantwoordelijke;
    @Size(max = 255)
    @Column(name = "netbeheerder")
    private String netbeheerder;
    @Size(max = 255)
    @Column(name = "netgebied")
    private String netgebied;
    @Size(max = 255)
    @Column(name = "straatnaam")
    private String straatnaam;
    @Size(max = 6)
    @Column(name = "postcode_van")
    private String postcodeVan;
    @Size(max = 6)
    @Column(name = "postcode_tot")
    private String postcodeTot;
    @Size(max = 255)
    @Column(name = "woonplaats")
    private String woonplaats;
    @Size(max = 2)
    @Column(name = "landcode")
    private String landcode;
    @Size(max = 3)
    @Column(name = "productsoort")
    private String productsoort;
    @Size(max = 3)
    @Column(name = "verbruikssegment")
    private String verbruikssegment;
    @Column(name = "aantal_aansluitingen")
    private Integer aantalAansluitingen;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "leveringsrichting")
    private BigDecimal leveringsrichting;
    @Column(name = "fysieke_status")
    private BigDecimal fysiekeStatus;
    @Column(name = "defintieve_aansl_nrm")
    private Integer defintieveAanslNrm;
    @Column(name = "soort_aansluiting")
    private Integer soortAansluiting;
    @Size(max = 255)
    @Column(name = "soort_aansluiting_naam")
    private String soortAansluitingNaam;
    @Column(name = "sjv")
    private Integer sjv;
    @Column(name = "sjv_laag_tarief")
    private BigDecimal sjvLaagTarief;
    @Column(name = "slimme_meter")
    private BigDecimal slimmeMeter;
    @Column(name = "gemiddeld_aantal_telwielen")
    private BigDecimal gemiddeldAantalTelwielen;

    public Kleinverbruik() {
    }

    public Kleinverbruik(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public String getJaar() {
        return jaar;
    }

    public String getMeetverantwoordelijke() {
        return meetverantwoordelijke;
    }

    public String getNetbeheerder() {
        return netbeheerder;
    }

    public String getNetgebied() {
        return netgebied;
    }

    public String getStraatnaam() {
        return straatnaam;
    }

    public String getPostcodeVan() {
        return postcodeVan;
    }

    public String getPostcodeTot() {
        return postcodeTot;
    }

    public String getWoonplaats() {
        return woonplaats;
    }

    public String getLandcode() {
        return landcode;
    }

    public String getProductsoort() {
        return productsoort;
    }

    public String getVerbruikssegment() {
        return verbruikssegment;
    }

    public Integer getAantalAansluitingen() {
        return aantalAansluitingen;
    }

    public BigDecimal getLeveringsrichting() {
        return leveringsrichting;
    }

    public BigDecimal getFysiekeStatus() {
        return fysiekeStatus;
    }

    public Integer getDefintieveAanslNrm() {
        return defintieveAanslNrm;
    }

    public Integer getSoortAansluiting() {
        return soortAansluiting;
    }

    public String getSoortAansluitingNaam() {
        return soortAansluitingNaam;
    }

    public Integer getSjv() {
        return sjv;
    }

    public BigDecimal getSjvLaagTarief() {
        return sjvLaagTarief;
    }

    public BigDecimal getSlimmeMeter() {
        return slimmeMeter;
    }

    public BigDecimal getGemiddeldAantalTelwielen() {
        return gemiddeldAantalTelwielen;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Kleinverbruik)) {
            return false;
        }
        Kleinverbruik other = (Kleinverbruik) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "Kleinverbruik[ id=" + id + " ]";
    }
}
