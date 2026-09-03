# Domain Glossary & Technical Context — AuraPredict AI

This document establishes the canonical domain vocabulary, atmospheric physics metrics, and remote sensing terminology used across AuraPredict AI codebase, documentation, tests, and pull requests.

---

## 🔬 Atmospheric Chemistry & Particulate Metrics

| Term | Full Name | Canonical Definition | Units |
| :--- | :--- | :--- | :--- |
| **AQI** | Air Quality Index | Standardized numerical scale (0–500) quantifying atmospheric pollutant severity. | Index (0–500) |
| **NAQI** | National Air Quality Index (India) | CPCB standard measuring 8 criteria pollutants: $PM_{2.5}, PM_{10}, NO_2, NH_3, SO_2, CO, O_3, Pb$. | Index (0–500) |
| **$\text{PM}_{2.5}$** | Fine Particulate Matter | Inhalable aerosol particles with aerodynamic diameter $\le 2.5\,\mu\text{m}$. Penetrates deep into alveolar capillary beds. | $\mu\text{g}/\text{m}^3$ |
| **$\text{PM}_{10}$** | Coarse Particulate Matter | Thoracic inhalable particles with aerodynamic diameter $\le 10\,\mu\text{m}$. Primary sources: road dust, construction, crushing. | $\mu\text{g}/\text{m}^3$ |
| **$\text{NO}_2$** | Nitrogen Dioxide | Reddish-brown combustion gas; major precursor to ground-level ozone and secondary nitrate aerosols. | $\mu\text{g}/\text{m}^3$ |
| **$\text{SO}_2$** | Sulfur Dioxide | Pungent gas released from coal combustion and heavy diesel fuel; precursor to sulfate aerosol hazes. | $\mu\text{g}/\text{m}^3$ |
| **$\text{O}_3$** | Ground-Level Ozone | Secondary photochemical oxidant synthesized via $NO_x + \text{VOC} + h\nu$ in sunlight. | $\mu\text{g}/\text{m}^3$ |
| **$\text{PBLH}$** | Planetary Boundary Layer Height | The vertical altitude above ground where turbulence and thermal mixing trap surface emissions. | meters ($m$) |
| **VOC** | Volatile Organic Compounds | Organic chemicals with high vapor pressure (benzene, formaldehyde, toluene) that drive photochemical smog. | $\text{ppb} / \mu\text{g}/\text{m}^3$ |
| **SOA** | Secondary Organic Aerosol | Particulates formed in the air by oxidation of gas-phase VOC precursors. | $\mu\text{g}/\text{m}^3$ |

---

## 🛰️ Remote Sensing & Satellite Telemetry

| Term | Description | Instrument / Source |
| :--- | :--- | :--- |
| **AOD / AOT** | **Aerosol Optical Depth (550nm)**: Degree to which aerosols prevent light transmission through the vertical atmospheric column. | NASA MODIS Aqua/Terra (`MYD04_L2`), VIIRS |
| **NDVI** | **Normalized Difference Vegetation Index**: Density of live green vegetation canopy ($\frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$). Used to calculate particulate filtration. | NASA MODIS Aqua (`MYD13A2`) |
| **EVI** | **Enhanced Vegetation Index**: High-sensitivity vegetation index that minimizes canopy background and aerosol distortions. | NASA MODIS Aqua (`MYD13A2`) |
| **FRP** | **Fire Radiative Power**: Thermal radiation intensity from active biomass combustion in Megawatts ($MW$). | NASA MODIS (`MYD14A1`), Sentinel-3 SLSTR |
| **TROPOMI** | Tropospheric Monitoring Instrument retrieving trace gas columns ($NO_2, SO_2, CO, CH_4$). | ESA Sentinel-5 Precursor |
| **NowCast** | US EPA algorithm converting fluctuating 1-hour sensor readings into a 12-hour weighted exposure metric. | US EPA AQS |

---

## 🧠 Machine Learning & Physics Formulations

| Concept | Mathematical / Architectural Role |
| :--- | :--- |
| **PINN** | **Physics-Informed Neural Network**: Loss function embeds the 2D/3D Navier-Stokes Advection-Diffusion equation: $\mathcal{L}_{PINN} = \mathcal{L}_{data} + \lambda \left\| \frac{\partial c}{\partial t} + \mathbf{u} \cdot \nabla c - D \nabla^2 c - R \right\|^2$. |
| **ST-GNN** | **Spatio-Temporal Graph Neural Network**: Nodes represent monitoring stations; edges represent atmospheric spatial distance and wind vector topology. |
| **Gaussian Plume** | Steady-state point source dispersion model: $C(x,y,z) = \frac{Q}{2\pi u \sigma_y \sigma_z} \exp\left(-\frac{y^2}{2\sigma_y^2}\right) \left[ \exp\left(-\frac{(z-H)^2}{2\sigma_z^2}\right) + \exp\left(-\frac{(z+H)^2}{2\sigma_z^2}\right) \right]$. |
| **Pasquill-Gifford** | Atmospheric stability classification system categorized from Class A (Extremely Unstable) to Class F (Moderately Stable). |
