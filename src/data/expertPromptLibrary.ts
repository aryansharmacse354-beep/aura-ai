export interface ExpertPromptItem {
  id: string;
  number: number;
  categoryId: 'cat1' | 'cat2' | 'cat3' | 'cat4' | 'cat5';
  category: string;
  title: string;
  shortTitle: string;
  badge: string;
  goal: string;
  system: string;
  context?: string;
  task: string;
  promptTemplate: string;
  mathematicalFormulations: {
    name: string;
    latex: string;
    description: string;
  }[];
  pythonCode: string;
  keyArchitecturalSpecs: string[];
  physicalJustifications: {
    featureOrComponent: string;
    physicsBasis: string;
  }[];
  defaultSimulationParams: Record<string, any>;
}

export interface PromptCategoryMeta {
  id: 'cat1' | 'cat2' | 'cat3' | 'cat4' | 'cat5';
  name: string;
  shortName: string;
  description: string;
  badge: string;
  count: number;
}

export const PROMPT_CATEGORIES: PromptCategoryMeta[] = [
  {
    id: 'cat1',
    name: 'Category 1: Model Architecture & PINN Loss Design',
    shortName: 'PINN & Architecture',
    description: 'Enforcing physics, chemistry, and spatial dynamics (Physics-Informed Neural Networks, Neural ODEs, Photochemistry).',
    badge: 'Physics / GNN',
    count: 4
  },
  {
    id: 'cat2',
    name: 'Category 2: Data Preprocessing & Sensor Calibration',
    shortName: 'Data & Calibration',
    description: 'Data quality, low-cost sensor relative humidity calibration, drift anomaly screening, and spatial imputation.',
    badge: 'Quality / Kriging',
    count: 4
  },
  {
    id: 'cat3',
    name: 'Category 3: Extreme Event & Synthetic Data Generation',
    shortName: 'Synthetic Extremes',
    description: 'Generating hard edge cases (wildfires, dust storms, industrial point leaks) for robust ML stress testing.',
    badge: 'Extremes / Plumes',
    count: 3
  },
  {
    id: 'cat4',
    name: 'Category 4: Multi-Horizon Forecasting & Evaluation',
    shortName: 'Forecasting & XAI',
    description: 'Lead-time benchmarking (1h–72h), SHAP explainability, seasonal concept drift, and cross-city zero-shot transfer.',
    badge: 'Evaluation / MLOps',
    count: 4
  },
  {
    id: 'cat5',
    name: 'Category 5: Policy, Risk Communication & Automated Alert Systems',
    shortName: 'Policy & Ensembles',
    description: 'Translating model outputs into public health advisories, urban policy counterfactuals, source apportionment, and audits.',
    badge: 'Policy / Health',
    count: 5
  }
];

export const SYSTEM_META_PROMPT = {
  systemRole: "Senior Atmospheric Data Scientist & Spatiotemporal Machine Learning Architect.",
  domainConstraints: [
    {
      num: 1,
      title: "Physics-Guided Principles",
      desc: "Always respect physical conservation laws, pollutant advection-diffusion dynamics, and atmospheric chemistry (e.g., O3-NOx photochemistry, secondary organic aerosol formation)."
    },
    {
      num: 2,
      title: "Spatiotemporal Dependency",
      desc: "Treat air quality data as non-stationary, spatially correlated across sensor networks (via GNNs/Kriging), and temporally cyclical (diurnal/seasonal patterns)."
    },
    {
      num: 3,
      title: "Data Multi-Modality",
      desc: "Integrate ground station data (EPA/low-cost sensors), meteorological reanalysis (ERA5/WRF), satellite remote sensing (Sentinel-5P, MODIS AOD), and emission inventories."
    },
    {
      num: 4,
      title: "Evaluation Rigor",
      desc: "Use spatially blocked cross-validation (not random split) and evaluate using RMSE, MAE, SMAPE, and threshold-based critical success index (CSI) for peak pollution events."
    }
  ],
  outputRequirements: "Provide precise code snippets (PyTorch/TensorFlow), mathematical definitions, feature transformation logic, and architectural specs."
};

export const EXPERT_PROMPTS_LIBRARY: ExpertPromptItem[] = [
  // =========================================================================
  // CATEGORY 1: MODEL ARCHITECTURE & PINN LOSS DESIGN (Prompts 1 - 4)
  // =========================================================================
  {
    id: "prompt-1",
    number: 1,
    categoryId: "cat1",
    category: "Category 1: Model Architecture & PINN Loss Design",
    title: "Advection-Diffusion Loss Function Generation",
    shortTitle: "Advection-Diffusion PINN",
    badge: "PINN / PyTorch",
    goal: "Formulate custom loss enforcing the 2D Advection-Diffusion PDE using PyTorch autograd gradients and dynamic gradient-norm scaling.",
    system: "You are an expert Machine Learning Engineer specializing in Physics-Informed Neural Networks (PINNs) for atmospheric fluid dynamics.",
    context: "We are training a Spatio-Temporal Graph Neural Network (ST-GNN) to forecast 2D ground-level $PM_{2.5}$ dispersion across a city grid.",
    task: `Write PyTorch code for a custom loss function that enforces the 2D Advection-Diffusion PDE:
$$\\frac{\\partial C}{\\partial t} = D \\left( \\frac{\\partial^2 C}{\\partial x^2} + \\frac{\\partial^2 C}{\\partial y^2} \\right) - u \\frac{\\partial C}{\\partial x} - v \\frac{\\partial C}{\\partial y} + S$$

Requirements:
1. Use PyTorch's \`torch.autograd.grad\` to compute continuous spatial derivatives ($\\partial C/\\partial x, \\partial C/\\partial y$) and temporal derivative ($\\partial C/\\partial t$).
2. Take predicted concentrations $C$, wind vectors ($u, v$), estimated diffusion coefficient $D$, and source/sink term $S$ as inputs.
3. Compute the residual loss $\\mathcal{L}_{\\text{physics}}$ and combine it with MSE data loss using dynamic gradient-norm scaling.`,
    promptTemplate: `<system>
You are an expert Machine Learning Engineer specializing in Physics-Informed Neural Networks (PINNs) for atmospheric fluid dynamics.
</system>

<context>
We are training a Spatio-Temporal Graph Neural Network (ST-GNN) to forecast 2D ground-level $PM_{2.5}$ dispersion across a city grid.
</context>

<task>
Write PyTorch code for a custom loss function that enforces the 2D Advection-Diffusion PDE:
$$\\frac{\\partial C}{\\partial t} = D \\left( \\frac{\\partial^2 C}{\\partial x^2} + \\frac{\\partial^2 C}{\\partial y^2} \\right) - u \\frac{\\partial C}{\\partial x} - v \\frac{\\partial C}{\\partial y} + S$$

Requirements:
1. Use PyTorch's \`torch.autograd.grad\` to compute continuous spatial derivatives ($\\partial C/\\partial x, \\partial C/\\partial y$) and temporal derivative ($\\partial C/\\partial t$).
2. Take predicted concentrations $C$, wind vectors ($u, v$), estimated diffusion coefficient $D$, and source/sink term $S$ as inputs.
3. Compute the residual loss $\\mathcal{L}_{\\text{physics}}$ and combine it with MSE data loss using dynamic gradient-norm scaling.
</task>`,
    mathematicalFormulations: [
      {
        name: "2D Atmospheric Advection-Diffusion-Source Transport PDE",
        latex: "\\frac{\\partial C}{\\partial t} = D \\left( \\frac{\\partial^2 C}{\\partial x^2} + \\frac{\\partial^2 C}{\\partial y^2} \\right) - u \\frac{\\partial C}{\\partial x} - v \\frac{\\partial C}{\\partial y} + S(x, y, t)",
        description: "Fundamental conservation of mass for scalar pollutant concentration C transported by wind field (u, v) with eddy diffusivity D and local emissions S."
      },
      {
        name: "Dynamic Gradient-Norm Loss Balancing (GradNorm)",
        latex: "\\mathcal{L}_{total} = \\mathcal{L}_{data} + \\lambda_{phys}(t) \\mathcal{L}_{pde}, \\quad \\lambda_{phys}(t) = \\alpha \\frac{\\| \\nabla_\\theta \\mathcal{L}_{data} \\|_2}{\\| \\nabla_\\theta \\mathcal{L}_{pde} \\|_2 + \\epsilon}",
        description: "Prevents vanishing or exploding physical gradients by dynamically rebalancing loss weights based on Euclidean gradient norms."
      }
    ],
    pythonCode: `import torch
import torch.nn as nn

class AdvectionDiffusionPINNLoss(nn.Module):
    """
    Computes 2D Advection-Diffusion PDE residual loss using torch.autograd.grad.
    """
    def __init__(self, alpha: float = 0.1, eps: float = 1e-7):
        super().__init__()
        self.mse_loss = nn.MSELoss()
        self.alpha = alpha
        self.eps = eps

    def compute_pde_residual(self, coords: torch.Tensor, C_pred: torch.Tensor, 
                             u: torch.Tensor, v: torch.Tensor, 
                             D: torch.Tensor, S: torch.Tensor) -> torch.Tensor:
        # coords: [B, 3] where cols are (x, y, t) with requires_grad=True
        # C_pred: [B, 1] predicted concentration
        grad_C = torch.autograd.grad(
            outputs=C_pred,
            inputs=coords,
            grad_outputs=torch.ones_like(C_pred),
            create_graph=True,
            retain_graph=True,
            only_inputs=True
        )[0]
        
        dC_dx = grad_C[:, 0:1]
        dC_dy = grad_C[:, 1:2]
        dC_dt = grad_C[:, 2:3]

        # Second spatial derivatives (Diffusion)
        d2C_dx2 = torch.autograd.grad(
            outputs=dC_dx,
            inputs=coords,
            grad_outputs=torch.ones_like(dC_dx),
            create_graph=True,
            retain_graph=True
        )[0][:, 0:1]

        d2C_dy2 = torch.autograd.grad(
            outputs=dC_dy,
            inputs=coords,
            grad_outputs=torch.ones_like(dC_dy),
            create_graph=True,
            retain_graph=True
        )[0][:, 1:2]

        # PDE residual: dC/dt - D*(d2C/dx2 + d2C/dy2) + u*dC/dx + v*dC/dy - S
        residual = dC_dt - D * (d2C_dx2 + d2C_dy2) + (u * dC_dx + v * dC_dy) - S
        return residual

    def forward(self, coords: torch.Tensor, C_pred: torch.Tensor, C_true: torch.Tensor,
                u: torch.Tensor, v: torch.Tensor, D: torch.Tensor, S: torch.Tensor,
                model_params: list = None) -> tuple:
        l_data = self.mse_loss(C_pred, C_true)
        residual = self.compute_pde_residual(coords, C_pred, u, v, D, S)
        l_pde = torch.mean(torch.abs(residual))
        
        # Adaptive gradient norm scaling
        lambda_phys = self.alpha
        if model_params is not None and len(model_params) > 0:
            g_data = torch.autograd.grad(l_data, model_params, retain_graph=True, allow_unused=True)
            g_pde = torch.autograd.grad(l_pde, model_params, retain_graph=True, allow_unused=True)
            norm_data = torch.sqrt(sum(torch.sum(g**2) for g in g_data if g is not None))
            norm_pde = torch.sqrt(sum(torch.sum(g**2) for g in g_pde if g is not None))
            lambda_phys = self.alpha * (norm_data / (norm_pde + self.eps)).item()
            
        total_loss = l_data + lambda_phys * l_pde
        return total_loss, l_data.item(), l_pde.item(), lambda_phys`,
    keyArchitecturalSpecs: [
      "Autograd-enabled spatio-temporal coordinate graph [x, y, t].",
      "Exact Laplacian diffusion formulation: D * (d2C/dx2 + d2C/dy2).",
      "Dynamic GradNorm loss rebalancing preventing gradient collapse.",
      "Conservative sink/source term integration."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Advection dot-product (u*dC/dx + v*dC/dy)",
        physicsBasis: "Preserves horizontal mass transport along streamlines governed by Reynolds-averaged Navier-Stokes equations."
      },
      {
        featureOrComponent: "Laplacian Diffusion Term D*(d2C/dx2 + d2C/dy2)",
        physicsBasis: "Fickian turbulent diffusion models isotropic eddy dispersion across boundary layer receptors."
      }
    ],
    defaultSimulationParams: {
      windU: 3.5,
      windV: -2.1,
      diffCoeff: 10.0,
      sourceRate: 5.0,
      lambdaPhys: 0.15
    }
  },
  {
    id: "prompt-2",
    number: 2,
    categoryId: "cat1",
    category: "Category 1: Model Architecture & PINN Loss Design",
    title: "Photochemical Reaction Mechanism Constraint",
    shortTitle: "Photochemistry & Leighton",
    badge: "Chemistry / O3-NOx",
    goal: "Formulate prompt and validation schema enforcing Leighton photostationary state and titration dynamics between NO, NO2, and O3.",
    system: "You are an Atmospheric Chemist and AI Systems Architect.",
    task: `Formulate an expert prompt and validation schema to enforce photochemical mass balance between $NO$, $NO_2$, and $O_3$ (Leighton Relationship) in multi-pollutant forecast outputs.

Input Variables: $[NO]_t, [NO_2]_t, [O_3]_t$, Solar Irradiance ($J_{NO2}$), Temperature ($T$).

Output Required:
1. Explain how to penalize nighttime Ozone generation (when $J_{NO2} = 0$).
2. Provide a Python validation function checking if predicted $[O_3]$ violates the titration limit ($NO + O_3 \\rightarrow NO_2 + O_2$).
3. Write a system instruction for an LLM agent to audit target model predictions for chemical inconsistency.`,
    promptTemplate: `<system>
You are an Atmospheric Chemist and AI Systems Architect.
</system>

<task>
Formulate an expert prompt and validation schema to enforce photochemical mass balance between $NO$, $NO_2$, and $O_3$ (Leighton Relationship) in multi-pollutant forecast outputs.

Input Variables: $[NO]_t, [NO_2]_t, [O_3]_t$, Solar Irradiance ($J_{NO2}$), Temperature ($T$).

Output Required:
1. Explain how to penalize nighttime Ozone generation (when $J_{NO2} = 0$).
2. Provide a Python validation function checking if predicted $[O_3]$ violates the titration limit ($NO + O_3 \\rightarrow NO_2 + O_2$).
3. Write a system instruction for an LLM agent to audit target model predictions for chemical inconsistency.
</task>`,
    mathematicalFormulations: [
      {
        name: "Leighton Photostationary State Ratio",
        latex: "[O_3]_{pss} = \\frac{J_{NO2} \\cdot [NO_2]}{k_3(T) \\cdot [NO]}, \\quad k_3(T) = 2.07 \\times 10^{-12} \\exp\\left(-\\frac{1400}{T}\\right) \\text{ cm}^3\\text{molec}^{-1}\\text{s}^{-1}",
        description: "Describes equilibrium in troposphere where UV photolysis of NO2 generates atomic oxygen forming O3, while NO rapidly titrates O3."
      },
      {
        name: "Nighttime Ozone Titration Constraint",
        latex: "\\text{When } J_{NO2} = 0: \\quad \\frac{d[O_3]}{dt} = -k_3(T)[NO][O_3] \\le 0, \\quad \\Delta [O_3] \\le -\\min([NO], [O_3])",
        description: "Without sunlight, secondary photolysis halts and ground ozone must monotonically decay in presence of primary vehicular NO."
      }
    ],
    pythonCode: `import numpy as np

def validate_leighton_chemistry(no_ppb: np.ndarray, no2_ppb: np.ndarray, 
                                o3_ppb: np.ndarray, solar_irradiance: np.ndarray, 
                                temp_kelvin: np.ndarray, tolerance: float = 0.25) -> dict:
    """
    Validates photochemical consistency between NO, NO2, and O3.
    """
    violations = []
    
    # Arrhenius rate constant for NO + O3 -> NO2 + O2
    k3 = 2.07e-12 * np.exp(-1400.0 / temp_kelvin)
    
    for t in range(len(no_ppb)):
        is_night = (solar_irradiance[t] < 1.0) # W/m2
        
        # Rule 1: Nighttime Ozone Generation Anomaly
        if is_night and t > 0:
            delta_o3 = o3_ppb[t] - o3_ppb[t-1]
            if delta_o3 > 2.0 and no_ppb[t] > 5.0: # Unphysical nocturnal O3 rise with local NO
                violations.append({
                    'timestep': t,
                    'type': 'NIGHTTIME_OZONE_PRODUCTION_VIOLATION',
                    'detail': f"O3 rose by {delta_o3:.2f} ppb at night while [NO]={no_ppb[t]:.1f} ppb."
                })
        
        # Rule 2: Titration Limit Violation
        # If [NO] is very high (> 50 ppb) and solar UV is low, [O3] should approach near-zero (< 15 ppb)
        if no_ppb[t] > 60.0 and solar_irradiance[t] < 100.0 and o3_ppb[t] > 30.0:
            violations.append({
                'timestep': t,
                'type': 'TITRATION_EQUILIBRIUM_VIOLATION',
                'detail': f"High [NO]={no_ppb[t]:.1f} ppb coexists with high [O3]={o3_ppb[t]:.1f} ppb without photolytic flux."
            })
            
    return {
        'total_timesteps': len(no_ppb),
        'violation_count': len(violations),
        'is_chemically_consistent': len(violations) == 0,
        'violations': violations
    }`,
    keyArchitecturalSpecs: [
      "Nocturnal penalty term: L_chem = ReLU(d[O3]/dt) * (1 - Solar_Mask).",
      "Leighton equilibrium soft constraint in multi-pollutant loss vector.",
      "Strict mass-conservation for total odd oxygen Ox = O3 + NO2."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Nighttime O3 Derivative Penalty",
        physicsBasis: "Ground-level ozone cannot be chemically synthesized at night; positive nighttime gradients violate tropospheric radical kinetics."
      }
    ],
    defaultSimulationParams: {
      no_ppb: 45.0,
      no2_ppb: 38.0,
      o3_ppb: 18.0,
      solar_rad: 0.0,
      temp_k: 293.15
    }
  },
  {
    id: "prompt-3",
    number: 3,
    categoryId: "cat1",
    category: "Category 1: Model Architecture & PINN Loss Design",
    title: "Graph Convolutional Adjacency Matrix Builder",
    shortTitle: "Wind-Aware Graph Adjacency",
    badge: "GNN / Graph Adjacency",
    goal: "Construct dynamic, wind-aware directed adjacency tensor A_ij(t) fusing spatial Gaussian decay with vector alignment similarity.",
    system: "You are a Spatial Data Scientist working on Graph Neural Networks (GNNs).",
    task: `Provide Python code to construct a dynamic, wind-aware directed adjacency matrix $A_{ij}(t)$ for a sensor network of $N$ air quality stations.

Formulas to incorporate:
1. Spatial Distance Decay: $W_{dist}(i, j) = \\exp\\left(-\\left(\\frac{d_{ij}}{\\sigma}\\right)^2\\right)$
2. Wind Alignment Vector: Directional similarity between wind vector $\\vec{v}_i(t)$ and vector $\\vec{r}_{ij}$ connecting station $i$ to station $j$.

The code must output a normalized PyTorch Sparse Tensor shape $(T, N, N)$ representing dynamic transport pathways across time steps $T$.`,
    promptTemplate: `<system>
You are a Spatial Data Scientist working on Graph Neural Networks (GNNs).
</system>

<task>
Provide Python code to construct a dynamic, wind-aware directed adjacency matrix $A_{ij}(t)$ for a sensor network of $N$ air quality stations.

Formulas to incorporate:
1. Spatial Distance Decay: $W_{dist}(i, j) = \\exp\\left(-\\left(\\frac{d_{ij}}{\\sigma}\\right)^2\\right)$
2. Wind Alignment Vector: Directional similarity between wind vector $\\vec{v}_i(t)$ and vector $\\vec{r}_{ij}$ connecting station $i$ to station $j$.

The code must output a normalized PyTorch Sparse Tensor shape $(T, N, N)$ representing dynamic transport pathways across time steps $T$.
</task>`,
    mathematicalFormulations: [
      {
        name: "Dynamic Wind-Directed Adjacency Formulation",
        latex: "A_{ij}(t) = \\exp\\left(-\\frac{d_{ij}^2}{\\sigma^2}\\right) \\cdot \\max\\left(0, \\frac{\\vec{V}_i(t) \\cdot \\vec{r}_{ij}}{\\|\\vec{V}_i(t)\\| \\|\\vec{r}_{ij}\\|}\\right)^\\gamma",
        description: "Modulates static Euclidean distance decay by the cosine similarity of wind velocity carrying pollutants from node i toward node j."
      },
      {
        name: "Degree Normalized Graph Laplacian",
        latex: "\\tilde{A}(t) = D(t)^{-\\frac{1}{2}} (A(t) + I) D(t)^{-\\frac{1}{2}}, \\quad D_{ii}(t) = 1 + \\sum_{j} A_{ij}(t)",
        description: "Symmetric normalization preventing spectral explosion during spatial graph message passing."
      }
    ],
    pythonCode: `import torch
import numpy as np

def build_dynamic_wind_adjacency(coords: np.ndarray, wind_u: np.ndarray, 
                                 wind_v: np.ndarray, sigma: float = 12.0, 
                                 gamma: float = 1.5) -> torch.Tensor:
    """
    Constructs dynamic wind-directed adjacency matrix: Shape (T, N, N).
    coords: [N, 2] in km (x, y)
    wind_u, wind_v: [T, N] zonal and meridional wind in m/s
    """
    N = len(coords)
    T = wind_u.shape[0]
    
    # 1. Static Spatial Distance Matrix
    diff = coords[:, np.newaxis, :] - coords[np.newaxis, :, :] # [N, N, 2]
    dists = np.linalg.norm(diff, axis=-1) # [N, N] in km
    W_dist = np.exp(-(dists / sigma)**2) # [N, N]
    np.fill_diagonal(W_dist, 1.0)
    
    # Unit direction vectors r_ij from station i to j
    unit_r = np.zeros_like(diff)
    mask = dists > 1e-4
    unit_r[mask] = diff[mask] / dists[mask, np.newaxis]
    
    adj_tensor = np.zeros((T, N, N), dtype=np.float32)
    
    for t in range(T):
        u_t = wind_u[t] # [N]
        v_t = wind_v[t] # [N]
        wind_speeds = np.sqrt(u_t**2 + v_t**2) + 1e-6
        unit_wind = np.stack([u_t / wind_speeds, v_t / wind_speeds], axis=-1) # [N, 2]
        
        # Dot product between wind at node i and direction to node j
        # unit_wind[:, np.newaxis, :] shape [N, 1, 2]
        # unit_r shape [N, N, 2]
        cos_sim = np.sum(unit_wind[:, np.newaxis, :] * unit_r, axis=-1) # [N, N]
        wind_alignment = np.maximum(0.0, cos_sim)**gamma
        
        A_t = W_dist * wind_alignment
        np.fill_diagonal(A_t, 1.0) # Self loops
        
        # Row normalization
        deg = np.sum(A_t, axis=-1, keepdims=True) + 1e-7
        adj_tensor[t] = A_t / deg
        
    return torch.from_numpy(adj_tensor)`,
    keyArchitecturalSpecs: [
      "Dynamic (T, N, N) sparse graph connectivity tensor.",
      "Wind transport alignment cosine filter eliminating upwind edge noise.",
      "Self-loop preservation ensuring local autoregressive persistence."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Directional Cosine Similarity r_ij . V_i",
        physicsBasis: "Air pollutants flow downstream along advective wind streamlines; upstream sensors contain zero predictive signal for downstream sources."
      }
    ],
    defaultSimulationParams: {
      sigma: 15.0,
      gamma: 1.5,
      nodes: 12,
      meanWindSpeed: 4.8
    }
  },
  {
    id: "prompt-4",
    number: 4,
    categoryId: "cat1",
    category: "Category 1: Model Architecture & PINN Loss Design",
    title: "Open-System Boundary Condition Modeling",
    shortTitle: "Neural ODE Boundary Fluxes",
    badge: "Neural ODE / Fluxes",
    goal: "Design Neural Ordinary Differential Equation specification separating system state into transboundary inflow, internal generation, and deposition fluxes.",
    system: "You are an Environmental Fluid Engineer specializing in open-system atmospheric transport modeling.",
    task: `Design a model prompt specification to train a Neural Ordinary Differential Equation (Neural ODE) model for open system air pollution forecasting.

Detail how the prompt should direct the LLM to separate system state into:
- Inflow Boundary Dynamics ($C_{in}$) driven by transboundary advection.
- Internal Generation Dynamics ($Q_{int}$) driven by local primary emissions.
- Outflow/Deposition Dynamics ($S_{sink}$) driven by dry/wet deposition and wind displacement.

Output a structured JSON schema that formats training data inputs explicitly isolating internal vs external fluxes.`,
    promptTemplate: `<system>
You are an Environmental Fluid Engineer specializing in open-system atmospheric transport modeling.
</system>

<task>
Design a model prompt specification to train a Neural Ordinary Differential Equation (Neural ODE) model for open system air pollution forecasting.

Detail how the prompt should direct the LLM to separate system state into:
- Inflow Boundary Dynamics ($C_{in}$) driven by transboundary advection.
- Internal Generation Dynamics ($Q_{int}$) driven by local primary emissions.
- Outflow/Deposition Dynamics ($S_{sink}$) driven by dry/wet deposition and wind displacement.

Output a structured JSON schema that formats training data inputs explicitly isolating internal vs external fluxes.
</task>`,
    mathematicalFormulations: [
      {
        name: "Open-System Continuous Atmospheric Flux ODE",
        latex: "\\frac{dC(t)}{dt} = \\Phi_{inflow}(C_{boundary}, \\vec{V}_{in}) + \\mathcal{N}_{internal}(E_{local}, T, PBLH) - \\left( \\frac{\\vec{V}_{out}}{L_{box}} + v_d(RH) \\right) C(t)",
        description: "Continuous conservation equation decoupling regional external transboundary influx from local urban emissions and dry deposition velocity."
      }
    ],
    pythonCode: `import torch
import torch.nn as nn

class OpenSystemAirQualityODE(nn.Module):
    """
    Neural ODE parameterized by decoupled boundary influx, internal generation, and sink deposition.
    """
    def __init__(self, hidden_dim: int = 64):
        super().__init__()
        # Internal generation network (local chemistry + emissions)
        self.internal_net = nn.Sequential(
            nn.Linear(6, hidden_dim),
            nn.SiLU(),
            nn.Linear(hidden_dim, 1)
        )
        
    def forward(self, t, C, C_inflow, u_in, u_out, pblh, v_dep):
        # Inflow Flux: external boundary concentration advected into domain
        flux_in = (u_in * C_inflow) / 10.0 # Normalized box length
        
        # Internal Generation Flux: primary traffic/industry + photochemistry
        features = torch.cat([C, pblh], dim=-1)
        gen_rate = torch.relu(self.internal_net(features))
        
        # Outflow & Deposition Sink Flux
        sink_rate = ((u_out / 10.0) + (v_dep / pblh)) * C
        
        dC_dt = flux_in + gen_rate - sink_rate
        return dC_dt`,
    keyArchitecturalSpecs: [
      "Explicit Inflow/Internal/Outflow boundary state decoupling.",
      "Dry deposition velocity parameterization v_d as function of humidity and surface roughness.",
      "Runge-Kutta 4th order numerical integrator compatibility."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Boundary Influx Decoupling",
        physicsBasis: "Megacity air quality is heavily driven by transboundary regional plumes (e.g. agricultural burning); treating cities as closed systems leads to severe model underprediction."
      }
    ],
    defaultSimulationParams: {
      c_inflow: 85.0,
      u_inflow: 5.2,
      u_outflow: 4.8,
      local_gen: 22.0,
      dep_vel: 0.012
    }
  },

  // =========================================================================
  // CATEGORY 2: DATA PREPROCESSING & SENSOR CALIBRATION (Prompts 5 - 8)
  // =========================================================================
  {
    id: "prompt-5",
    number: 5,
    categoryId: "cat2",
    category: "Category 2: Data Preprocessing & Sensor Calibration",
    title: "Low-Cost Optical Sensor Relative Humidity Calibration",
    shortTitle: "κ-Köhler RH Calibration",
    badge: "Calibration / Köhler",
    goal: "Draft expert prompt to fit non-linear κ-Köhler hygroscopic growth curves to calibrate low-cost optical particle counters under high RH (>70%).",
    system: "You are a Sensor Calibration Specialist in Environmental Instrumentation.",
    context: "Low-cost optical particle counters (OPCs) report falsely inflated $PM_{2.5}$ readings under high Relative Humidity ($RH > 70\\%$) due to hygroscopic growth of hydrophilic aerosols (e.g., sulfates, nitrates).",
    task: `Draft an expert prompt for an AI agent to fit a non-linear hygroscopic correction factor $\\kappa$-Köhler theory curve:
$$f(RH) = 1 + \\kappa \\cdot \\frac{RH}{100 - RH}$$

Given a dataset containing low-cost OPC $PM_{2.5}$, reference FEM/FRM instrument $PM_{2.5}$, $RH$, and Temperature:
1. Compute optimal $\\kappa$ per season.
2. Filter out sensor noise vs genuine aerosol accumulation events.
3. Return the corrected time-series array alongside fit performance metrics ($R^2$, $RMSE$, $MAE$).`,
    promptTemplate: `<system>
You are a Sensor Calibration Specialist in Environmental Instrumentation.
</system>

<context>
Low-cost optical particle counters (OPCs) report falsely inflated $PM_{2.5}$ readings under high Relative Humidity ($RH > 70\\%$) due to hygroscopic growth of hydrophilic aerosols (e.g., sulfates, nitrates).
</context>

<task>
Draft an expert prompt for an AI agent to fit a non-linear hygroscopic correction factor $\\kappa$-Köhler theory curve:
$$f(RH) = 1 + \\kappa \\cdot \\frac{RH}{100 - RH}$$

Given a dataset containing low-cost OPC $PM_{2.5}$, reference FEM/FRM instrument $PM_{2.5}$, $RH$, and Temperature:
1. Compute optimal $\\kappa$ per season.
2. Filter out sensor noise vs genuine aerosol accumulation events.
3. Return the corrected time-series array alongside fit performance metrics ($R^2$, $RMSE$, $MAE$).
</task>`,
    mathematicalFormulations: [
      {
        name: "κ-Köhler Aerosol Hygroscopic Swelling Growth Factor",
        latex: "f(RH) = 1 + \\kappa \\cdot \\frac{RH}{100 - RH}, \\quad PM_{2.5, \\text{dry}} = \\frac{PM_{2.5, \\text{raw}}}{f(RH)}",
        description: "Quantifies water vapor condensation on hydrophilic salts (sulfates, nitrates) inflating optical scattering diameters."
      },
      {
        name: "Non-Linear Least Squares Objective for Kappa Optimization",
        latex: "\\kappa^* = \\arg\\min_\\kappa \\sum_{i=1}^M \\left( PM_{2.5, \\text{ref}, i} - \\frac{PM_{2.5, \\text{raw}, i}}{1 + \\kappa \\cdot \\frac{RH_i}{100 - RH_i}} \\right)^2",
        description: "Fits the empirical hygroscopicity parameter kappa against co-located regulatory reference monitors."
      }
    ],
    pythonCode: `import numpy as np
from scipy.optimize import curve_fit
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

def fit_kohler_calibration(raw_pm25: np.ndarray, ref_pm25: np.ndarray, rh: np.ndarray):
    """
    Fits kappa-Köhler hygroscopic growth factor and produces calibrated PM2.5.
    """
    # Valid filter: RH between 20% and 98%
    valid = (rh > 20.0) & (rh < 98.0) & (raw_pm25 > 0) & (ref_pm25 > 0)
    raw_v, ref_v, rh_v = raw_pm25[valid], ref_pm25[valid], rh[valid]
    
    def kohler_model(rh_vals, kappa):
        growth = 1.0 + kappa * (rh_vals / (100.0 - rh_vals))
        return raw_v / growth
        
    popt, _ = curve_fit(kohler_model, rh_v, ref_v, p0=[0.25], bounds=(0.01, 1.5))
    best_kappa = popt[0]
    
    growth_factors = 1.0 + best_kappa * (rh / np.clip(100.0 - rh, 1.0, 100.0))
    calibrated_pm25 = raw_pm25 / growth_factors
    
    metrics = {
        'optimal_kappa': float(best_kappa),
        'raw_r2': float(r2_score(ref_v, raw_v)),
        'calibrated_r2': float(r2_score(ref_v, calibrated_pm25[valid])),
        'calibrated_rmse': float(np.sqrt(mean_squared_error(ref_v, calibrated_pm25[valid]))),
        'calibrated_mae': float(mean_absolute_error(ref_v, calibrated_pm25[valid]))
    }
    return calibrated_pm25, metrics`,
    keyArchitecturalSpecs: [
      "Physical kappa-Köhler bounding (0.01 <= kappa <= 1.5).",
      "Dynamic singularity protection at RH >= 99%.",
      "Seasonal stratified calibration parameter fitting."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Hygroscopic Growth Equation f(RH)",
        physicsBasis: "Water uptake increases particle cross-sectional area, scattering significantly more 650nm laser light than dry mineral core."
      }
    ],
    defaultSimulationParams: {
      rawPM25: 85.0,
      rh: 82.0,
      kappa: 0.28,
      temperature: 18.5
    }
  },
  {
    id: "prompt-6",
    number: 6,
    categoryId: "cat2",
    category: "Category 2: Data Preprocessing & Sensor Calibration",
    title: "Spatio-Temporal Sensor Drift and Failure Detection",
    shortTitle: "Mesh Drift & Failure Detection",
    badge: "IoT Reliability / MAD",
    goal: "Screen an incoming 500-sensor IoT stream for zero-drift flatlines, high-frequency non-physical spikes (>5σ), and gradual variance degradation.",
    system: "You are a Lead Reliability Engineer for an IoT Sensor Mesh Network.",
    task: `Write a multi-step prompt that instructs an AI system to scan an incoming stream of 500 air quality sensors and flag:
1. Zero-drift / Flatlining: Constant non-zero values over 6+ hours.
2. High-Frequency Spikes: Non-physical single-step jumps exceeding 5 standard deviations ($\\sigma$) not matched by adjacent spatial neighbors within 3 km.
3. Sensor Degradation: Gradual decrease in signal variance relative to neighboring stations.

The prompt must force the AI to return a JSON array containing sensor IDs, error flags, confidence scores, and recommended data imputation strategies.`,
    promptTemplate: `<system>
You are a Lead Reliability Engineer for an IoT Sensor Mesh Network.
</system>

<task>
Write a multi-step prompt that instructs an AI system to scan an incoming stream of 500 air quality sensors and flag:
1. Zero-drift / Flatlining: Constant non-zero values over 6+ hours.
2. High-Frequency Spikes: Non-physical single-step jumps exceeding 5 standard deviations ($\\sigma$) not matched by adjacent spatial neighbors within 3 km.
3. Sensor Degradation: Gradual decrease in signal variance relative to neighboring stations.

The prompt must force the AI to return a JSON array containing sensor IDs, error flags, confidence scores, and recommended data imputation strategies.
</task>`,
    mathematicalFormulations: [
      {
        name: "Spatial Median Absolute Deviation (MAD) Z-Score",
        latex: "Z_{MAD, i}(t) = \\frac{| C_i(t) - \\text{median}_{j \\in \\mathcal{N}_i}(C_j(t)) |}{1.4826 \\cdot \\text{MAD}_{j \\in \\mathcal{N}_i}(C_j(t))}",
        description: "Robust non-parametric outlier metric comparing candidate sensor against median of spatial neighbors within 3 km."
      },
      {
        name: "Relative Rolling Variance Ratio (Sensor Degradation)",
        latex: "\\gamma_{deg, i} = \\frac{\\text{Var}_{24h}(C_i)}{\\text{mean}_{j \\in \\mathcal{N}_i}(\\text{Var}_{24h}(C_j)) + \\epsilon}",
        description: "Identifies dust accumulation over optical chambers causing signal attenuation and reduced dynamic response."
      }
    ],
    pythonCode: `import numpy as np

def detect_sensor_anomalies(sensor_id: str, time_series: np.ndarray, neighbor_series: np.ndarray):
    """
    Flags flatlines, spikes, and degradation for a sensor.
    """
    flags = []
    
    # 1. Zero-drift / Flatlining check (6+ hours constant)
    diffs = np.diff(time_series[-6:])
    if len(diffs) >= 5 and np.all(np.abs(diffs) < 1e-4):
        flags.append({
            'code': 'ERR_SENSOR_FLATLINE',
            'severity': 'HIGH',
            'confidence': 0.98,
            'action': 'SPATIAL_KRIGING_IMPUTATION'
        })
        
    # 2. Spatial Neighbor Spike Check
    latest_val = time_series[-1]
    neighbor_vals = neighbor_series[:, -1]
    med = np.median(neighbor_vals)
    mad = 1.4826 * np.median(np.abs(neighbor_vals - med)) + 1e-4
    z_score = abs(latest_val - med) / mad
    
    if z_score > 5.0 and latest_val > 100.0:
        flags.append({
            'code': 'ERR_NON_PHYSICAL_SPIKE',
            'severity': 'CRITICAL',
            'confidence': min(0.99, float(z_score / 8.0)),
            'action': 'DISCARD_AND_INTERPOLATE'
        })
        
    # 3. Variance Degradation
    var_self = np.var(time_series[-24:])
    var_neighbors = np.mean([np.var(neighbor_series[k, -24:]) for k in range(neighbor_series.shape[0])]) + 1e-4
    if (var_self / var_neighbors) < 0.15:
        flags.append({
            'code': 'ERR_VARIANCE_ATTENUATION_DEGRADATION',
            'severity': 'MEDIUM',
            'confidence': 0.85,
            'action': 'TRIGGER_FIELD_CLEANING_ALERT'
        })
        
    return {
        'sensor_id': sensor_id,
        'has_anomaly': len(flags) > 0,
        'flags': flags
    }`,
    keyArchitecturalSpecs: [
      "Robust Median Absolute Deviation spatial gating.",
      "Automated fallback strategy assignment (IDW vs Kriging vs Kalman filter).",
      "Low false-positive rate during real regional plume passages."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Neighborhood MAD Check",
        physicsBasis: "Atmospheric turbulence maintains regional spatial continuity; localized 5-sigma spikes without neighbor confirmation are electrical glitches or insect ingress."
      }
    ],
    defaultSimulationParams: {
      spikeMagnitude: 420.0,
      neighborMedian: 62.0,
      flatlineHours: 7,
      varianceRatio: 0.11
    }
  },
  {
    id: "prompt-7",
    number: 7,
    categoryId: "cat2",
    category: "Category 2: Data Preprocessing & Sensor Calibration",
    title: "Kriging vs. Machine Learning Spatial Imputation",
    shortTitle: "Spatial Kriging vs RF",
    badge: "Spatial / Kriging",
    goal: "Evaluate Ordinary Kriging vs Random Forest spatial interpolation for unmonitored target grids based on sensor density and satellite AOD coverage.",
    system: "You are a Geostatistician and Machine Learning Researcher.",
    task: `Create an advanced prompt to evaluate spatial interpolation techniques for an unmonitored target location $(x_0, y_0)$.

Compare:
- Ordinary Kriging (using variogram parameters: nugget, sill, range).
- Random Forest Spatial Interpolation (using spatial distances + satellite AOD + terrain elevation).

Provide instructions for an automated prompt pipeline that selects the optimal method based on current spatial sensor density and cloud cover over satellite sensors.`,
    promptTemplate: `<system>
You are a Geostatistician and Machine Learning Researcher.
</system>

<task>
Create an advanced prompt to evaluate spatial interpolation techniques for an unmonitored target location $(x_0, y_0)$.

Compare:
- Ordinary Kriging (using variogram parameters: nugget, sill, range).
- Random Forest Spatial Interpolation (using spatial distances + satellite AOD + terrain elevation).

Provide instructions for an automated prompt pipeline that selects the optimal method based on current spatial sensor density and cloud cover over satellite sensors.
</task>`,
    mathematicalFormulations: [
      {
        name: "Ordinary Kriging Best Linear Unbiased Estimator (BLUE)",
        latex: "\\hat{Z}(x_0) = \\sum_{i=1}^N \\lambda_i Z(x_i), \\quad \\text{s.t. } \\sum_{i=1}^N \\lambda_i = 1, \\quad \\mathbf{\\Gamma} \\mathbf{\\lambda} = \\mathbf{\\gamma}_0",
        description: "Optimal spatial covariance weighting incorporating spatial autocorrelation through empirical semivariogram gamma(h)."
      },
      {
        name: "Spherical Semivariogram Model",
        latex: "\\gamma(h) = c_0 + c \\left( \\frac{3h}{2a} - \\frac{h^3}{2a^3} \\right) \\text{ for } h \\le a, \\quad \\gamma(h) = c_0 + c \\text{ for } h > a",
        description: "Models spatial decorrelation with distance h where c0 is nugget, c is sill, and a is spatial correlation range."
      }
    ],
    pythonCode: `import numpy as np

def select_spatial_imputer(sensor_density_per_100km2: float, cloud_cover_percent: float, target_elev_gradient: float):
    """
    Automated selector choosing between Ordinary Kriging and ML Random Forest.
    """
    # If satellite AOD is clear (< 30% clouds) and terrain is complex, RF with remote sensing excels
    if cloud_cover_percent < 30.0 and target_elev_gradient > 150.0:
        return {
            'selected_method': 'RANDOM_FOREST_GEO_SATELLITE',
            'reason': 'Clear satellite AOD available and high elevation gradient favors non-linear feature fusion.',
            'confidence': 0.92
        }
    # In dense sensor clusters with heavy clouds, Ordinary Kriging guarantees BLUE minimum variance
    elif sensor_density_per_100km2 > 8.0:
        return {
            'selected_method': 'ORDINARY_KRIGING',
            'reason': 'Dense spatial sensor mesh satisfies isotropic variogram range without satellite dependence.',
            'confidence': 0.95
        }
    else:
        return {
            'selected_method': 'HYBRID_RESIDUAL_KRIGING',
            'reason': 'Sparse network requires Random Forest trend model with Kriged residual corrections.',
            'confidence': 0.88
        }`,
    keyArchitecturalSpecs: [
      "Dynamic model switching based on Sentinel-5P / MODIS cloud-mask coverage.",
      "Variogram nugget/sill auto-fitting with Nelder-Mead optimization.",
      "Spatial cross-validation protocol."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Semivariogram Range Parameter",
        physicsBasis: "Represents the horizontal spatial correlation length scale imposed by regional boundary layer turbulence."
      }
    ],
    defaultSimulationParams: {
      nugget: 12.0,
      sill: 145.0,
      rangeKm: 28.0,
      sensorDensity: 11.5,
      cloudCover: 18.0
    }
  },
  {
    id: "prompt-8",
    number: 8,
    categoryId: "cat2",
    category: "Category 2: Data Preprocessing & Sensor Calibration",
    title: "Vertical Sounding Data Ingestion for Boundary Layer Inversion",
    shortTitle: "PBLH & Inversion Index",
    badge: "Sounding / Radiosonde",
    goal: "Parse vertical radiosonde profiles up to 3000m to calculate lapse rates, detect inversion base heights, and compute an Inversion Trap Index.",
    system: "You are a Boundary Layer Meteorologist.",
    task: `Write an ingestion prompt that parses raw atmospheric radiosonde vertical profile data (pressure, altitude, temperature, dew point, wind speed) to detect Planetary Boundary Layer Height (PBLH) and Temperature Inversion layers.

Input Data Format: Multi-level vertical profile table up to 3000m.

Output Requirements:
1. Calculate lapse rate $\\frac{dT}{dz}$ per 100m layer.
2. Flag the base height ($m$) and strength ($^\\circ C$) of thermal inversion layers.
3. Compute an "Inversion Trap Index" (scale 0-10) indicating potential for localized ground-level pollutant accumulation.`,
    promptTemplate: `<system>
You are a Boundary Layer Meteorologist.
</system>

<task>
Write an ingestion prompt that parses raw atmospheric radiosonde vertical profile data (pressure, altitude, temperature, dew point, wind speed) to detect Planetary Boundary Layer Height (PBLH) and Temperature Inversion layers.

Input Data Format: Multi-level vertical profile table up to 3000m.

Output Requirements:
1. Calculate lapse rate $\\frac{dT}{dz}$ per 100m layer.
2. Flag the base height ($m$) and strength ($^\\circ C$) of thermal inversion layers.
3. Compute an "Inversion Trap Index" (scale 0-10) indicating potential for localized ground-level pollutant accumulation.
</task>`,
    mathematicalFormulations: [
      {
        name: "Vertical Temperature Lapse Rate Calculation",
        latex: "\\Gamma = -\\frac{\\Delta T}{\\Delta z} = -\\frac{T(z_{k+1}) - T(z_k)}{z_{k+1} - z_k}",
        description: "Negative lapse rate (dT/dz > 0) indicates thermal inversion where warm air aloft suppresses convective turbulence."
      },
      {
        name: "Inversion Trap Index (ITI 0-10)",
        latex: "\\text{ITI} = \\min\\left(10, \\frac{\\Delta T_{inv} \\cdot 1000}{\\max(100, z_{base}) \\cdot (1 + w_{surface})} \\right)",
        description: "Calculates pollutant trapping severity based on inversion strength delta T, low inversion base height, and light surface wind."
      }
    ],
    pythonCode: `import numpy as np

def compute_inversion_trap_index(altitudes_m: np.ndarray, temps_c: np.ndarray, surface_wind_speed: float):
    """
    Parses vertical sounding profile and calculates Inversion Trap Index (0-10).
    """
    dT_dz = np.diff(temps_c) / (np.diff(altitudes_m) / 100.0) # °C per 100m
    
    inversions = []
    for i in range(len(dT_dz)):
        if dT_dz[i] > 0.0: # Temperature increases with altitude
            base_alt = altitudes_m[i]
            top_alt = altitudes_m[i+1]
            strength = temps_c[i+1] - temps_c[i]
            inversions.append({
                'base_m': float(base_alt),
                'top_m': float(top_alt),
                'strength_c': float(strength),
                'lapse_rate_c_per_100m': float(dT_dz[i])
            })
            
    if not inversions:
        return {'has_inversion': False, 'trap_index': 0.0, 'inversions': []}
        
    # Strongest low-level inversion
    low_inversions = [inv for inv in inversions if inv['base_m'] < 1000.0]
    if low_inversions:
        primary = max(low_inversions, key=lambda x: x['strength_c'])
        # Trap Index formula
        trap_index = min(10.0, (primary['strength_c'] * 800.0) / (max(80.0, primary['base_m']) * (1.0 + surface_wind_speed * 0.3)))
    else:
        trap_index = 2.0
        primary = inversions[0]
        
    return {
        'has_inversion': True,
        'trap_index': round(float(trap_index), 2),
        'primary_inversion': primary,
        'all_inversions': inversions
    }`,
    keyArchitecturalSpecs: [
      "High-resolution 100m layer vertical gradient processing.",
      "Low-level capping inversion detection (<1000m AGL).",
      "Direct integration into hourly ST-GNN meteorological embedding."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Inversion Base Height & Strength",
        physicsBasis: "Acts as a rigid atmospheric lid; shallow nocturnal inversions (<200m) with high positive dT cause catastrophic winter smog episodes."
      }
    ],
    defaultSimulationParams: {
      surfaceTemp: 14.0,
      sounding950hpa: 19.5,
      baseHeight: 220,
      surfaceWind: 1.2
    }
  },

  // =========================================================================
  // CATEGORY 3: EXTREME EVENT & SYNTHETIC DATA GENERATION (Prompts 9 - 11)
  // =========================================================================
  {
    id: "prompt-9",
    number: 9,
    categoryId: "cat3",
    category: "Category 3: Extreme Event & Synthetic Data Generation",
    title: "Wildfire Smoke Plume Downwind Simulation",
    shortTitle: "Wildfire Plume Simulation",
    badge: "Wildfire / Biomass",
    goal: "Generate a realistic 48-hour multi-pollutant synthetic time series simulating upstream wildfire smoke arrival, peak stagnation, and cold front cleansing.",
    system: "You are an Atmospheric Scientist specializing in biomass burning emissions and atmospheric transport.",
    task: `Generate a 48-hour synthetic time-series dataset simulating the impact of a severe upstream wildfire plume arriving over an urban center.

Simulated Event Profile:
- Hours 0-12: Baseline urban conditions.
- Hours 13-18: Plume arrival ($PM_{2.5}/PM_{10}$ ratio spikes from 0.4 to 0.85; CO increases 4x; $O_3$ titration followed by secondary photochemical formation).
- Hours 19-36: Peak smoke stagnation under light winds ($<1.0\\text{ m/s}$).
- Hours 37-48: Cold front passage (wind speed increases to $6\\text{ m/s}$, precipitation cleanses particulates via wet deposition).

Format output as CSV with columns: \`timestamp, pm2_5, pm10, co_ppm, o3_ppb, wind_speed_ms, precip_mm, aerosol_optical_depth\`.`,
    promptTemplate: `<system>
You are an Atmospheric Scientist specializing in biomass burning emissions and atmospheric transport.
</system>

<task>
Generate a 48-hour synthetic time-series dataset simulating the impact of a severe upstream wildfire plume arriving over an urban center.

Simulated Event Profile:
- Hours 0-12: Baseline urban conditions.
- Hours 13-18: Plume arrival ($PM_{2.5}/PM_{10}$ ratio spikes from 0.4 to 0.85; CO increases 4x; $O_3$ titration followed by secondary photochemical formation).
- Hours 19-36: Peak smoke stagnation under light winds ($<1.0\\text{ m/s}$).
- Hours 37-48: Cold front passage (wind speed increases to $6\\text{ m/s}$, precipitation cleanses particulates via wet deposition).

Format output as CSV with columns: \`timestamp, pm2_5, pm10, co_ppm, o3_ppb, wind_speed_ms, precip_mm, aerosol_optical_depth\`.
</task>`,
    mathematicalFormulations: [
      {
        name: "Stoichiometric Biomass Burning Ratio",
        latex: "\\Delta PM_{2.5}(t) = \\text{ER}_{PM/CO} \\cdot \\Delta CO(t) + \\text{SOA}_{form}(t), \\quad \\text{ER} \\approx 0.10 - 0.14 \\frac{\\mu g/m^3}{\\text{ppb}}",
        description: "Primary emission ratio of particulate carbon to incomplete combustion tracer CO with secondary organic aerosol formation."
      },
      {
        name: "Wet Deposition Washout Flux",
        latex: "\\frac{dC_{pm}}{dt} = -\\Lambda(P) C_{pm}, \\quad \\Lambda(P) = a P^b, \\quad b \\approx 0.8",
        description: "Exponential particulate scavenging by falling raindrops during precipitation rate P (mm/h)."
      }
    ],
    pythonCode: `import numpy as np
import pandas as pd

def generate_wildfire_smoke_48h(start_time: str = '2026-08-14 00:00'):
    """
    Synthesizes 48h wildfire plume episode with exact physical phase transitions.
    """
    t = np.arange(48)
    pm25 = np.zeros(48)
    pm10 = np.zeros(48)
    co = np.zeros(48)
    o3 = np.zeros(48)
    ws = np.zeros(48)
    precip = np.zeros(48)
    aod = np.zeros(48)
    
    # Phase 1: Baseline (0 - 12h)
    pm25[0:12] = 25.0 + 5.0 * np.sin(t[0:12]) + np.random.normal(0, 2, 12)
    pm10[0:12] = pm25[0:12] / 0.42
    co[0:12] = 0.6 + 0.1 * np.random.randn(12)
    o3[0:12] = 35.0 + 15.0 * np.sin(2 * np.pi * t[0:12] / 24.0)
    ws[0:12] = 3.2 + 0.4 * np.random.randn(12)
    aod[0:12] = 0.25 + 0.05 * np.random.randn(12)
    
    # Phase 2: Plume Arrival (13 - 18h)
    ramp = np.linspace(0, 1, 6)
    pm25[12:18] = 25.0 + ramp * 280.0
    pm10[12:18] = pm25[12:18] / np.linspace(0.42, 0.86, 6)
    co[12:18] = 0.6 + ramp * 3.8
    o3[12:18] = np.maximum(8.0, 35.0 - ramp * 22.0) # NO titration
    ws[12:18] = np.linspace(3.2, 1.1, 6)
    aod[12:18] = 0.25 + ramp * 2.2
    
    # Phase 3: Peak Stagnation (19 - 36h)
    pm25[18:36] = 310.0 + 35.0 * np.sin(np.linspace(0, np.pi, 18)) + np.random.normal(0, 8, 18)
    pm10[18:36] = pm25[18:36] / 0.88
    co[18:36] = 4.6 + 0.4 * np.random.randn(18)
    o3[18:36] = 65.0 + 20.0 * np.sin(2 * np.pi * t[18:36] / 24.0) # Secondary photochemistry
    ws[18:36] = 0.7 + 0.2 * np.random.randn(18)
    aod[18:36] = 2.8 + 0.2 * np.random.randn(18)
    
    # Phase 4: Cold Front Washout (37 - 48h)
    washout = np.exp(-0.28 * np.arange(12))
    pm25[36:48] = 20.0 + 290.0 * washout + np.random.normal(0, 2, 12)
    pm10[36:48] = pm25[36:48] / 0.45
    co[36:48] = 0.5 + 4.0 * washout
    o3[36:48] = 28.0 + 5.0 * np.random.randn(12)
    ws[36:48] = 6.2 + 0.8 * np.random.randn(12)
    precip[36:44] = [2.5, 6.8, 8.2, 5.4, 3.1, 1.2, 0.4, 0.1]
    aod[36:48] = 0.2 + 2.5 * washout
    
    timestamps = pd.date_range(start_time, periods=48, freq='1H').strftime('%Y-%m-%d %H:%M')
    return pd.DataFrame({
        'timestamp': timestamps,
        'pm2_5': np.round(pm25, 1),
        'pm10': np.round(pm10, 1),
        'co_ppm': np.round(co, 2),
        'o3_ppb': np.round(o3, 1),
        'wind_speed_ms': np.round(ws, 1),
        'precip_mm': np.round(precip, 1),
        'aerosol_optical_depth': np.round(aod, 2)
    })`,
    keyArchitecturalSpecs: [
      "Physical stoichiometric PM2.5 / CO ratio tracking.",
      "PM2.5/PM10 fine-fraction signature evolution (0.40 -> 0.88).",
      "Wet scavenging exponential clearance dynamics."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "PM2.5/PM10 Ratio Shift to 0.85+",
        physicsBasis: "Biomass combustion generates predominantly sub-micron accumulation-mode aerosol (0.1 - 0.5 um), driving PM2.5/PM10 ratio dramatically above urban dust baseline."
      }
    ],
    defaultSimulationParams: {
      peakPM25: 340.0,
      peakCO: 4.8,
      frontWindSpeed: 6.5,
      precipMax: 8.2
    }
  },
  {
    id: "prompt-10",
    number: 10,
    categoryId: "cat3",
    category: "Category 3: Extreme Event & Synthetic Data Generation",
    title: "Dust Storm / Transboundary Coarse Particulate Simulation",
    shortTitle: "Dust Storm Simulation",
    badge: "Dust / Coarse Particulates",
    goal: "Synthesize extreme mineral dust storm scenarios with high PM10 (>800 µg/m³), low PM2.5/PM10 (<0.15), and arid low humidity (<25%).",
    system: "You are a Climatologist specializing in arid dust transportation dynamics.",
    task: `Create a synthetic data generation prompt that outputs a high $PM_{10}$ low $PM_{2.5}$ scenario (Dust Storm Event).

Constraints:
- $PM_{10}$ spikes above $800 \\ \\mu g/m^3$.
- $PM_{2.5} / PM_{10}$ ratio drops below 0.15 (indicating dominant coarse mineral dust).
- Relative Humidity drops below 25%.
- Surface gustiness ($u_{max} > 12\\text{ m/s}$) aligned with the prevailing desert transport corridor.

Provide the prompt instructions to generate 100 variations of this event with injected sensor noise for robustness training.`,
    promptTemplate: `<system>
You are a Climatologist specializing in arid dust transportation dynamics.
</system>

<task>
Create a synthetic data generation prompt that outputs a high $PM_{10}$ low $PM_{2.5}$ scenario (Dust Storm Event).

Constraints:
- $PM_{10}$ spikes above $800 \\ \\mu g/m^3$.
- $PM_{2.5} / PM_{10}$ ratio drops below 0.15 (indicating dominant coarse mineral dust).
- Relative Humidity drops below 25%.
- Surface gustiness ($u_{max} > 12\\text{ m/s}$) aligned with the prevailing desert transport corridor.

Provide the prompt instructions to generate 100 variations of this event with injected sensor noise for robustness training.
</task>`,
    mathematicalFormulations: [
      {
        name: "Saltation Dust Emission Threshold",
        latex: "F_{dust} = C_{salt} \\cdot \\frac{\\rho_a}{g} u_*^3 \\left(1 - \\frac{u_{*t}^2}{u_*^2}\\right) \\text{ for } u_* > u_{*t}",
        description: "Non-linear horizontal saltation flux releasing coarse mineral particles when friction velocity exceeds aerodynamic threshold."
      },
      {
        name: "Coarse Particle Volume Fraction",
        latex: "\\text{Coarse Fraction} = 1 - \\frac{PM_{2.5}}{PM_{10}} \\ge 0.85, \\quad RH < 25\\%",
        description: "Distinct mineral dust optical signature clearly separated from combustion smoke."
      }
    ],
    pythonCode: `import numpy as np

def generate_dust_storm_profile(n_samples: int = 100):
    """
    Generates variations of severe coarse mineral dust events.
    """
    events = []
    for i in range(n_samples):
        duration = np.random.randint(18, 36)
        peak_pm10 = np.random.uniform(850.0, 1450.0)
        pm_ratio = np.random.uniform(0.08, 0.14)
        peak_pm25 = peak_pm10 * pm_ratio
        rh_t = np.random.uniform(12.0, 24.0)
        wind_gust = np.random.uniform(12.5, 21.0)
        
        events.append({
            'variation_id': i + 1,
            'duration_hours': duration,
            'peak_pm10': round(peak_pm10, 1),
            'peak_pm25': round(peak_pm25, 1),
            'pm25_pm10_ratio': round(pm_ratio, 3),
            'relative_humidity_pct': round(rh_t, 1),
            'wind_gust_ms': round(wind_gust, 1)
        })
    return events`,
    keyArchitecturalSpecs: [
      "Inverted PM2.5/PM10 fine-fraction constraint (<0.15).",
      "Extreme friction velocity thresholding (u* > 0.4 m/s).",
      "Aridity coupling with hygroscopicity suppression."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Low PM2.5/PM10 Ratio (< 0.15)",
        physicsBasis: "Windblown mineral dust consists of mechanically pulverized crustal minerals (silicates, carbonates) concentrated in coarse 2.5 - 10 um modes."
      }
    ],
    defaultSimulationParams: {
      peakPM10: 920.0,
      pmRatio: 0.11,
      windGust: 14.8,
      rh: 19.0
    }
  },
  {
    id: "prompt-11",
    number: 11,
    categoryId: "cat3",
    category: "Category 3: Extreme Event & Synthetic Data Generation",
    title: "Industrial Chemical Leak Anomaly Ingestion",
    shortTitle: "Industrial Leak Plume",
    badge: "Hazards / Gaussian Plume",
    goal: "Formulate anomaly-injection prompt to train ensemble detectors for sudden point-source emissions of SO2/VOCs using Gaussian plume physics.",
    system: "You are an Industrial Hazards Response Specialist and Environmental Data Analyst.",
    task: `Construct an anomaly-injection prompt designed to synthetic-train an ensemble detector for sudden localized point-source emissions (e.g., chemical plant leakage of $SO_2$ or $VOCs$).

Include parameters for:
- Sharp exponential rise time ($t_{half} < 15\\text{ minutes}$).
- High spatial gradient (Station A reads $500\\text{ ppb}$, Station B 500m away reads $12\\text{ ppb}$).
- Downwind dispersion cone calculated using a Gaussian Plume model.`,
    promptTemplate: `<system>
You are an Industrial Hazards Response Specialist and Environmental Data Analyst.
</system>

<task>
Construct an anomaly-injection prompt designed to synthetic-train an ensemble detector for sudden localized point-source emissions (e.g., chemical plant leakage of $SO_2$ or $VOCs$).

Include parameters for:
- Sharp exponential rise time ($t_{half} < 15\\text{ minutes}$).
- High spatial gradient (Station A reads $500\\text{ ppb}$, Station B 500m away reads $12\\text{ ppb}$).
- Downwind dispersion cone calculated using a Gaussian Plume model.
</task>`,
    mathematicalFormulations: [
      {
        name: "Steady-State Gaussian Plume Dispersion Equation",
        latex: "C(x,y,z) = \\frac{Q}{2\\pi u \\sigma_y(x) \\sigma_z(x)} \\exp\\left(-\\frac{y^2}{2\\sigma_y(x)^2}\\right) \\left[ \\exp\\left(-\\frac{(z-H)^2}{2\\sigma_z(x)^2}\\right) + \\exp\\left(-\\frac{(z+H)^2}{2\\sigma_z(x)^2}\\right) \\right]",
        description: "Standard analytical solution for point-source emission rate Q at effective stack height H under crosswind y and downwind distance x."
      }
    ],
    pythonCode: `import numpy as np

def gaussian_leak_dispersion(Q_g_per_s: float, u_ms: float, H_m: float, 
                            x_coords: np.ndarray, y_coords: np.ndarray):
    """
    Computes ground-level concentration field for industrial chemical release.
    """
    # Pasquill-Gifford dispersion coefficients for Class D (neutral)
    sigma_y = 0.08 * x_coords * np.power(1.0 + 0.0001 * x_coords, -0.5)
    sigma_z = 0.06 * x_coords * np.power(1.0 + 0.0015 * x_coords, -0.5)
    
    sigma_y = np.maximum(sigma_y, 1.0)
    sigma_z = np.maximum(sigma_z, 1.0)
    
    # Ground-level z = 0
    exp_y = np.exp(- (y_coords**2) / (2.0 * sigma_y**2))
    exp_z = 2.0 * np.exp(- (H_m**2) / (2.0 * sigma_z**2)) # Ground reflection
    
    C_ug_m3 = (Q_g_per_s * 1e6) / (2.0 * np.pi * u_ms * sigma_y * sigma_z) * exp_y * exp_z
    return C_ug_m3`,
    keyArchitecturalSpecs: [
      "Pasquill-Gifford atmospheric stability classification (A to F).",
      "Exponential temporal onset rise curve (t_half < 15 min).",
      "Ground reflection boundary symmetry."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Crosswind Gaussian Exponential Decay exp(-y^2 / 2sigma_y^2)",
        physicsBasis: "Lateral turbulent velocity fluctuations produce Gaussian concentration cross-sections across downwind receptor arrays."
      }
    ],
    defaultSimulationParams: {
      emissionRateQ: 120.0,
      windSpeedU: 3.2,
      stackHeightH: 35.0,
      downwindDistX: 450.0
    }
  },

  // =========================================================================
  // CATEGORY 4: MULTI-HORIZON FORECASTING & EVALUATION (Prompts 12 - 15)
  // =========================================================================
  {
    id: "prompt-12",
    number: 12,
    categoryId: "cat4",
    category: "Category 4: Multi-Horizon Forecasting & Evaluation",
    title: "Multi-Horizon Lead Time Stress Test Prompt",
    shortTitle: "Multi-Horizon Stress Test",
    badge: "Evaluation / EVCR",
    goal: "Construct evaluation prompt comparing model accuracy across 1h, 6h, 12h, 24h, 72h lead times, calculating RMSE, Extreme Value Capture Rate (EVCR), and Directional Accuracy.",
    system: "You are an ML Evaluation Engineer specializing in time-series forecasting benchmarks.",
    task: `Construct an evaluation prompt that compares model predictions across 1h, 6h, 12h, 24h, and 72h forecast horizons.

The prompt must instruct an evaluation LLM agent to compute:
1. $RMSE$, $MAE$, $MAPE$, and $R^2$ decay rate as horizon increases.
2. Extreme Value Capture Rate (EVCR): Percentage of top 5% peak pollution events correctly predicted within a $\\pm 2\\text{-hour}$ window.
3. Directional Accuracy (DA): Correct prediction of concentration trends (rising vs. falling).

Include a structured evaluation report template output.`,
    promptTemplate: `<system>
You are an ML Evaluation Engineer specializing in time-series forecasting benchmarks.
</system>

<task>
Construct an evaluation prompt that compares model predictions across 1h, 6h, 12h, 24h, and 72h forecast horizons.

The prompt must instruct an evaluation LLM agent to compute:
1. $RMSE$, $MAE$, $MAPE$, and $R^2$ decay rate as horizon increases.
2. Extreme Value Capture Rate (EVCR): Percentage of top 5% peak pollution events correctly predicted within a $\\pm 2\\text{-hour}$ window.
3. Directional Accuracy (DA): Correct prediction of concentration trends (rising vs. falling).

Include a structured evaluation report template output.
</task>`,
    mathematicalFormulations: [
      {
        name: "Extreme Value Capture Rate (EVCR within +/- 2h)",
        latex: "\\text{EVCR}_{95\\%} = \\frac{1}{|\\mathcal{P}_{95}|} \\sum_{t \\in \\mathcal{P}_{95}} \\mathbb{I}\\left( \\max_{\\tau \\in [t-2, t+2]} C_{pred}(\\tau) \\ge 0.85 \\cdot C_{true}(t) \\right)",
        description: "Measures whether high-risk peak episodes exceeding 95th percentile are anticipated in time for public warnings."
      },
      {
        name: "Directional Accuracy (Trend Concordance)",
        latex: "\\text{DA} = \\frac{1}{T-1} \\sum_{t=2}^T \\mathbb{I}\\left( \\text{sign}(C_{pred}(t) - C_{true}(t-1)) == \\text{sign}(C_{true}(t) - C_{true}(t-1)) \\right)",
        description: "Evaluates whether the model correctly forecasts the inflection direction (air quality worsening vs improving)."
      }
    ],
    pythonCode: `import numpy as np

def evaluate_multi_horizon_benchmark(y_true: dict, y_pred: dict):
    """
    Computes RMSE, MAE, R2, EVCR, and Directional Accuracy across 1h, 6h, 12h, 24h, 72h.
    y_true, y_pred are dicts keyed by horizon: '1h', '6h', '12h', '24h', '72h'
    """
    report = {}
    horizons = ['1h', '6h', '12h', '24h', '72h']
    
    for h in horizons:
        yt = np.array(y_true[h])
        yp = np.array(y_pred[h])
        
        rmse = np.sqrt(np.mean((yt - yp)**2))
        mae = np.mean(np.abs(yt - yp))
        r2 = 1.0 - (np.sum((yt - yp)**2) / (np.sum((yt - np.mean(yt))**2) + 1e-6))
        
        # 95th percentile threshold
        thresh = np.percentile(yt, 95)
        peak_indices = np.where(yt >= thresh)[0]
        hits = 0
        for idx in peak_indices:
            window_start = max(0, idx - 2)
            window_end = min(len(yp), idx + 3)
            if np.max(yp[window_start:window_end]) >= 0.85 * yt[idx]:
                hits += 1
        evcr = (hits / len(peak_indices)) * 100.0 if len(peak_indices) > 0 else 100.0
        
        # Directional accuracy
        actual_diff = np.diff(yt)
        pred_diff = np.diff(yp)
        da = np.mean(np.sign(actual_diff) == np.sign(pred_diff)) * 100.0
        
        report[h] = {
            'rmse': round(float(rmse), 2),
            'mae': round(float(mae), 2),
            'r2': round(float(r2), 3),
            'evcr_pct': round(float(evcr), 1),
            'directional_accuracy_pct': round(float(da), 1)
        }
    return report`,
    keyArchitecturalSpecs: [
      "Multi-horizon lead-time decay curve evaluation.",
      "Temporal tolerance window (+/- 2h) for peak episodic alerts.",
      "Concordance sign direction tracking."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "EVCR Peak Metric",
        physicsBasis: "Average RMSE conceals failure during rare acute spikes; public health risk is dominated by extreme episodic exposures."
      }
    ],
    defaultSimulationParams: {
      rmse_1h: 6.8,
      rmse_24h: 18.4,
      rmse_72h: 31.2,
      evcr_24h: 84.5
    }
  },
  {
    id: "prompt-13",
    number: 13,
    categoryId: "cat4",
    category: "Category 4: Multi-Horizon Forecasting & Evaluation",
    title: "Model Explainability & SHAP Feature Attribution Prompt",
    shortTitle: "SHAP Feature Attribution",
    badge: "XAI / SHAP",
    goal: "Translate SHAP feature attribution weights into an environmental regulator technical diagnosis detailing physical boundary layer mechanics.",
    system: "You are an Explainable AI (XAI) Lead Specialist in Environmental Science.",
    context: `An XGBoost + LSTM hybrid model has predicted a $150 \\ \\mu g/m^3$ surge in $PM_{2.5}$ in 4 hours.
Feature attribution weights (SHAP values):
- Boundary Layer Height drop: +45%
- Wind Speed reduction: +25%
- Upwind Station $PM_{2.5}$ spike: +20%
- Relative Humidity rise: +10%`,
    task: `Translate these SHAP values into an expert-level technical diagnosis suitable for environmental regulators, detailing the physical mechanics behind the forecast.`,
    promptTemplate: `<system>
You are an Explainable AI (XAI) Lead Specialist in Environmental Science.
</system>

<context>
An XGBoost + LSTM hybrid model has predicted a $150 \\ \\mu g/m^3$ surge in $PM_{2.5}$ in 4 hours.
Feature attribution weights (SHAP values):
- Boundary Layer Height drop: +45%
- Wind Speed reduction: +25%
- Upwind Station $PM_{2.5}$ spike: +20%
- Relative Humidity rise: +10%
</context>

<task>
Translate these SHAP values into an expert-level technical diagnosis suitable for environmental regulators, detailing the physical mechanics behind the forecast.
</task>`,
    mathematicalFormulations: [
      {
        name: "Shapley Additive Explanations (SHAP)",
        latex: "f(x) = \\phi_0 + \\sum_{i=1}^M \\phi_i, \\quad \\phi_i = \\sum_{S \\subseteq F \\setminus \\{i\\}} \\frac{|S|!(|F| - |S| - 1)!}{|F|!} \\left( f(S \\cup \\{i\\}) - f(S) \\right)",
        description: "Game-theoretic fair attribution dividing model prediction delta among meteorological and emissions features."
      }
    ],
    pythonCode: `def generate_regulator_shap_diagnosis(shap_dict: dict, predicted_surge_pm25: float) -> str:
    """
    Translates SHAP weights into an actionable environmental technical brief.
    """
    pblh_contrib = shap_dict.get('pblh_drop_pct', 45)
    wind_contrib = shap_dict.get('wind_calm_pct', 25)
    upwind_contrib = shap_dict.get('upwind_pm25_pct', 20)
    rh_contrib = shap_dict.get('rh_rise_pct', 10)
    
    return f"""EXECUTIVE REGULATORY AIR QUALITY DIAGNOSIS
--------------------------------------------------
Alert: Forecasted PM2.5 Surge of +{predicted_surge_pm25:.1f} ug/m3 in next 4 hours.

Physical Mechanism Breakdown:
1. Nocturnal Boundary Layer Compression ({pblh_contrib}% attribution):
   Rapid radiative cooling is collapsing the boundary layer mixing volume from 850m to <250m,
   compressing ground-level emissions into a shallow inversion layer.

2. Atmospheric Stagnation & Venting Stoppage ({wind_contrib}% attribution):
   Surface winds decelerating below 1.2 m/s, dropping horizontal ventilation index (WS x PBLH)
   below critical threshold of 600 m2/s.

3. Transboundary Advection Influx ({upwind_contrib}% attribution):
   Upwind industrial corridor plume arriving via residual low-level drift.

4. Secondary Aerosol Partitioning ({rh_contrib}% attribution):
   Relative humidity exceeding 75% accelerating heterogeneous conversion of SO2 and NOx into sulfates/nitrates.

Regulatory Recommendation: Trigger Emergency Industrial Throttling (Tier-2) and ban heavy diesel transit."""`,
    keyArchitecturalSpecs: [
      "Exact Shapley efficiency and symmetry guarantees.",
      "Physical translation: Meteorological dilution vs primary emission vs chemistry.",
      "Actionable emergency response mapping."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Ventilation Index (WS x PBLH)",
        physicsBasis: "Atmospheric assimilative capacity scales directly with mixing height and horizontal wind throughput."
      }
    ],
    defaultSimulationParams: {
      pblh_drop: 45,
      wind_calm: 25,
      upwind_spike: 20,
      rh_rise: 10
    }
  },
  {
    id: "prompt-14",
    number: 14,
    categoryId: "cat4",
    category: "Category 4: Multi-Horizon Forecasting & Evaluation",
    title: "Model Drift and Concept Drift Diagnostic",
    shortTitle: "MLOps Covariate vs Concept Drift",
    badge: "MLOps / Drift",
    goal: "Design automated MLOps monitoring agent analyzing seasonal transition from dry Autumn to cold inversion Winter, discriminating Covariate Shift from Concept Drift.",
    system: "You are an MLOps Engineer monitoring an active production model for air quality forecasting.",
    task: `Design a prompt for an automated MLOps monitoring agent that analyzes target model performance during a seasonal transition (e.g., transition from dry Autumn to cold inversion Winter).

Inputs provided to agent: Monthly $MAE$ per pollutant, residual distribution histograms, feature importance drift metrics.

Agent Output Required:
1. Determine if performance loss is due to **Covariate Shift** (change in weather patterns) or **Concept Drift** (new emission sources / policy changes).
2. Recommend retraining strategy (e.g., window size adjustment, feature recalculation, fine-tuning vs retrain from scratch).`,
    promptTemplate: `<system>
You are an MLOps Engineer monitoring an active production model for air quality forecasting.
</system>

<task>
Design a prompt for an automated MLOps monitoring agent that analyzes target model performance during a seasonal transition (e.g., transition from dry Autumn to cold inversion Winter).

Inputs provided to agent: Monthly $MAE$ per pollutant, residual distribution histograms, feature importance drift metrics.

Agent Output Required:
1. Determine if performance loss is due to **Covariate Shift** (change in weather patterns) or **Concept Drift** (new emission sources / policy changes).
2. Recommend retraining strategy (e.g., window size adjustment, feature recalculation, fine-tuning vs retrain from scratch).
</task>`,
    mathematicalFormulations: [
      {
        name: "Covariate Shift (P(X) changes while P(Y|X) constant)",
        latex: "P_{train}(X) \\ne P_{deploy}(X) \\quad \\text{and} \\quad P_{train}(Y|X) = P_{deploy}(Y|X)",
        description: "Meteorological distributions shift with seasons (colder temps, shallower PBLH), but underlying physical dispersion laws remain invariant."
      },
      {
        name: "Concept Drift (P(Y|X) changes)",
        latex: "P_{train}(Y|X) \\ne P_{deploy}(Y|X), \\quad \\text{KL}\\left( P(Y|X) \\parallel Q(Y|X) \\right) > \\tau",
        description: "Emission inventory fundamentally changes (e.g., winter space heating activated or odd-even traffic ban enforced)."
      }
    ],
    pythonCode: `from scipy.stats import ks_2samp

def diagnose_drift_type(train_features: dict, deploy_features: dict, 
                        train_residuals: list, deploy_residuals: list):
    """
    Identifies whether performance degradation is Covariate Shift or Concept Drift.
    """
    # 1. Kolmogorov-Smirnov test on input features (P(X))
    feature_shifts = {}
    for feat in ['temperature', 'pblh', 'wind_speed', 'traffic_index']:
        stat, p_val = ks_2samp(train_features[feat], deploy_features[feat])
        feature_shifts[feat] = {'p_val': p_val, 'shifted': p_val < 0.01}
        
    # 2. Residual mean shift test on P(Y|X)
    res_stat, res_p_val = ks_2samp(train_residuals, deploy_residuals)
    
    is_concept_drift = res_p_val < 0.01 and np.abs(np.mean(deploy_residuals) - np.mean(train_residuals)) > 12.0
    has_covariate_shift = any(f['shifted'] for f in feature_shifts.values())
    
    if is_concept_drift and has_covariate_shift:
        classification = "DUAL_SHIFT_SEASONAL_EMISSIONS"
        strategy = "FULL_RETRAIN_WITH_WINTER_EMISSION_FACTORS"
    elif is_concept_drift:
        classification = "CONCEPT_DRIFT_POLICY_OR_NEW_SOURCE"
        strategy = "FINE_TUNE_LAST_LAYERS_ONLINE_LEARNING"
    elif has_covariate_shift:
        classification = "COVARIATE_SHIFT_METEOROLOGICAL_TRANSITION"
        strategy = "IMPORTANCE_WEIGHTING_OR_DOMAIN_ADAPTATION"
    else:
        classification = "STABLE_IN_CONTROL"
        strategy = "NO_ACTION"
        
    return {
        'classification': classification,
        'recommended_retrain_strategy': strategy,
        'feature_shifts': feature_shifts,
        'residual_shift_p_val': float(res_p_val)
    }`,
    keyArchitecturalSpecs: [
      "Two-sample Kolmogorov-Smirnov distribution divergence testing.",
      "Residual bias tracking for unmodeled winter space heating.",
      "Automated rolling retraining trigger."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Residual Bias Tracking",
        physicsBasis: "A systematic positive residual bias in winter indicates new unmeasured heating emissions rather than statistical noise."
      }
    ],
    defaultSimulationParams: {
      ks_pblh_pval: 0.0002,
      mae_autumn: 12.4,
      mae_winter: 26.8,
      residual_bias: 14.5
    }
  },
  {
    id: "prompt-15",
    number: 15,
    categoryId: "cat4",
    category: "Category 4: Multi-Horizon Forecasting & Evaluation",
    title: "Cross-City Zero-Shot Generalization Prompt",
    shortTitle: "Zero-Shot Cross-City Transfer",
    badge: "Transfer / Generalization",
    goal: "Evaluate zero-shot transfer of model trained on Coastal City A to Mountainous Industrial Basin City B, isolating topography and emission inventory errors.",
    system: "You are a Generalizable AI Researcher in Environmental Modeling.",
    task: `Write a prompt to test a model trained on City A (Coastal, humid, sea-breeze dominated) when deployed in zero-shot mode to City B (Inland, mountainous basin, industrial emissions).

Instruct the evaluator to isolate:
1. Domain adaptation errors caused by localized topographical features (e.g., mountain-valley breezes).
2. Failure modes in transfer learning regarding base emission inventories.
3. Parameter adaptation recommendations for model fine-tuning.`,
    promptTemplate: `<system>
You are a Generalizable AI Researcher in Environmental Modeling.
</system>

<task>
Write a prompt to test a model trained on City A (Coastal, humid, sea-breeze dominated) when deployed in zero-shot mode to City B (Inland, mountainous basin, industrial emissions).

Instruct the evaluator to isolate:
1. Domain adaptation errors caused by localized topographical features (e.g., mountain-valley breezes).
2. Failure modes in transfer learning regarding base emission inventories.
3. Parameter adaptation recommendations for model fine-tuning.
</task>`,
    mathematicalFormulations: [
      {
        name: "Domain Adversarial Generalization Discrepancy",
        latex: "d_{\\mathcal{H}\\Delta\\mathcal{H}}(\\mathcal{D}_A, \\mathcal{D}_B) = 2 \\sup_{h, h' \\in \\mathcal{H}} \\left| \\mathbb{E}_{x \\sim \\mathcal{D}_A}[h(x) \\ne h'(x)] - \\mathbb{E}_{x \\sim \\mathcal{D}_B}[h(x) \\ne h'(x)] \\right|",
        description: "Quantifies generalization bound between source coastal distribution and target inland basin distribution."
      }
    ],
    pythonCode: `def analyze_cross_city_transfer_error(errors_by_wind_sector: dict, elevation_correlation: float):
    """
    Diagnoses zero-shot transfer bottlenecks from Coastal City A to Basin City B.
    """
    diagnostics = []
    
    # Check for valley katabatic wind error
    if errors_by_wind_sector.get('night_downslope', 0) > 35.0:
        diagnostics.append({
            'failure_mode': 'MOUNTAIN_VALLEY_KATABATIC_DRAINAGE_DEFECT',
            'detail': 'Model fails to anticipate nocturnal cold-air drainage pooling pollutants in basin center.'
        })
        
    if elevation_correlation > 0.65:
        diagnostics.append({
            'failure_mode': 'OROGRAPHIC_ELEVATION_BARRIER_DEFECT',
            'detail': 'Ridge blocking dispersion not captured by coastal planar assumption.'
        })
        
    return {
        'transfer_status': 'REQUIRES_TOPOGRAPHIC_ADAPTER',
        'diagnostics': diagnostics,
        'recommended_fine_tuning': 'Freeze temporal encoder, fine-tune spatial graph attention with DEM elevation features.'
    }`,
    keyArchitecturalSpecs: [
      "Topographic Adapter Module incorporating Digital Elevation Models (DEM).",
      "Source/Target domain alignment with Maximum Mean Discrepancy (MMD).",
      "Parameter-efficient LoRA fine-tuning."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Topographic DEM Ridge Features",
        physicsBasis: "Inland basins suffer from thermal stratification and mountain-valley wind reversals absent in coastal sea-breeze regimes."
      }
    ],
    defaultSimulationParams: {
      sourceCity: "Coastal Metropolis",
      targetCity: "Inland Mountain Basin",
      zeroShotMAE: 34.2,
      fineTunedMAE: 14.8
    }
  },

  // =========================================================================
  // CATEGORY 5: POLICY, RISK COMMUNICATION & AUTOMATED ALERTS (Prompts 16 - 20)
  // =========================================================================
  {
    id: "prompt-16",
    number: 16,
    categoryId: "cat5",
    category: "Category 5: Policy, Risk Communication & Automated Alert Systems",
    title: "Public Health Advisory Generation Matrix",
    shortTitle: "Demographic Advisory Matrix",
    badge: "EPA/WHO / Advisory JSON",
    goal: "Generate automated, stratified health advisories for 4 demographic tiers (General, Sensitive, Outdoor Workers, Schools/Sports) across all 6 criteria pollutants.",
    system: "You are an Environmental Health Risk Communicator working with WHO/EPA guidelines.",
    task: `Create an automated prompt that ingests 24-hour forecasted concentrations for all 6 criteria pollutants ($PM_{2.5}, PM_{10}, NO_2, SO_2, O_3, CO$) and generates tailored action advisories for four distinct demographic tiers:
1. General Population
2. Sensitive Groups (Asthma, Elderly, Children)
3. Outdoor Workers
4. Schools & Sports Organizations

Format the output as a clean, standardized JSON payload for push-notification services.`,
    promptTemplate: `<system>
You are an Environmental Health Risk Communicator working with WHO/EPA guidelines.
</system>

<task>
Create an automated prompt that ingests 24-hour forecasted concentrations for all 6 criteria pollutants ($PM_{2.5}, PM_{10}, NO_2, SO_2, O_3, CO$) and generates tailored action advisories for four distinct demographic tiers:
1. General Population
2. Sensitive Groups (Asthma, Elderly, Children)
3. Outdoor Workers
4. Schools & Sports Organizations

Format the output as a clean, standardized JSON payload for push-notification services.
</task>`,
    mathematicalFormulations: [
      {
        name: "EPA Breakpoint Linear Piecewise Sub-Index Formula",
        latex: "I_p = \\frac{I_{Hi} - I_{Lo}}{BP_{Hi} - BP_{Lo}} (C_p - BP_{Lo}) + I_{Lo}, \\quad \\text{Overall AQI} = \\max_{p} (I_p)",
        description: "Converts raw microgram/ppb concentrations into standardized 0-500 air quality index scale."
      },
      {
        name: "Multi-Pollutant Synergistic Toxicity Risk Index",
        latex: "R_{multi} = 1 + \\sum_{p} \\beta_p \\frac{C_p}{\\text{WHO}_p} + \\gamma \\left( \\frac{C_{PM2.5}}{\\text{WHO}_{PM2.5}} \\cdot \\frac{C_{O3}}{\\text{WHO}_{O3}} \\right)",
        description: "Models non-linear pulmonary oxidative stress exacerbation when high particulates co-occur with high ozone."
      }
    ],
    pythonCode: `import json

def generate_demographic_advisories_json(pm25: float, pm10: float, no2: float, o3: float, city: str):
    """
    Generates structured multi-tier push notification payload.
    """
    # Identify dominant pollutant
    dominant = "PM2.5" if pm25 > 35.0 else ("O3" if o3 > 70.0 else "NO2")
    severity = "HAZARDOUS" if pm25 > 250 else ("UNHEALTHY" if pm25 > 55 else "MODERATE")
    
    payload = {
        'target_region': city,
        'dominant_driver': dominant,
        'severity_level': severity,
        'demographic_tiers': {
            'tier_1_general_population': {
                'headline': f"Air Quality is {severity} in {city}.",
                'action': "Reduce prolonged strenuous outdoor activity; keep windows closed during peak morning rush.",
                'ventilation_recommendation': "Run HEPA air purifiers in recirculate mode."
            },
            'tier_2_sensitive_groups': {
                'headline': "High Health Hazard for Respiratory & Cardiac Conditions.",
                'action': "Avoid outdoor exertion entirely. Keep rescue inhalers accessible.",
                'recommended_ppe': "Wear N95/FFP2 sealed particulate respirator if stepping outside."
            },
            'tier_3_outdoor_workers': {
                'headline': "Occupational Exposure Limit Warning.",
                'action': "Mandate 15-minute clean air refuge breaks every 90 minutes. Provide N95 respirators.",
                'hydration_protocol': "Maintain active hydration to support airway mucosal clearance."
            },
            'tier_4_schools_and_sports': {
                'headline': "School Recess and Athletics Restriction.",
                'action': "Cancel outdoor physical education and athletic matches; relocate sports to indoor filtered facilities.",
                'transport_protocol': "Ensure zero-idling of school buses in student boarding zones."
            }
        }
    }
    return json.dumps(payload, indent=2)`,
    keyArchitecturalSpecs: [
      "Standardized REST / Webhook push-notification schema.",
      "Multi-pollutant synergistic oxidative stress logic.",
      "EPA/WHO compliant health warning tiers."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "O3 + PM2.5 Non-linear Cross-Term",
        physicsBasis: "Ozone damages epithelial alveolar lining, increasing pulmonary permeability to deeply penetrating fine PM2.5 particles."
      }
    ],
    defaultSimulationParams: {
      pm25: 115.0,
      pm10: 185.0,
      no2: 52.0,
      o3: 78.0
    }
  },
  {
    id: "prompt-17",
    number: 17,
    categoryId: "cat5",
    category: "Category 5: Policy, Risk Communication & Automated Alert Systems",
    title: "Urban Emission Control Simulation (Counterfactual Analysis)",
    shortTitle: "Counterfactual Policy Simulator",
    badge: "Policy / Counterfactual",
    goal: "Evaluate hypothetical policy interventions (diesel traffic cuts, industrial shutdowns) estimating net µg/m³ reductions over 24 hours.",
    system: "You are an Urban Policy Simulation Expert.",
    task: `Build a counterfactual prompt where the AI platform evaluates the impact of hypothetical policy interventions on an upcoming severe air pollution forecast.

Scenarios to simulate:
- Scenario A: 50% reduction in heavy-duty diesel vehicle traffic.
- Scenario B: Temporary shutdown of top 10 industrial point-sources within 30km radius.
- Scenario C: Combined traffic restriction + industrial throttling.

The prompt must direct the underlying physics surrogate model to estimate the net predicted $\\mu g/m^3$ reduction in $PM_{2.5}$ and $NO_2$ for each scenario over a 24-hour horizon.`,
    promptTemplate: `<system>
You are an Urban Policy Simulation Expert.
</system>

<task>
Build a counterfactual prompt where the AI platform evaluates the impact of hypothetical policy interventions on an upcoming severe air pollution forecast.

Scenarios to simulate:
- Scenario A: 50% reduction in heavy-duty diesel vehicle traffic.
- Scenario B: Temporary shutdown of top 10 industrial point-sources within 30km radius.
- Scenario C: Combined traffic restriction + industrial throttling.

The prompt must direct the underlying physics surrogate model to estimate the net predicted $\\mu g/m^3$ reduction in $PM_{2.5}$ and $NO_2$ for each scenario over a 24-hour horizon.
</task>`,
    mathematicalFormulations: [
      {
        name: "Counterfactual Emission Factor Modification",
        latex: "E_{sim}(x,y,t) = \\sum_{k \\in \\text{sectors}} (1 - \\alpha_k) E_k(x,y,t), \\quad \\Delta C(x,y,t) = \\mathcal{M}_{surrogate}(E_{sim}, \\mathbf{W}) - \\mathcal{M}_{baseline}(E_{orig}, \\mathbf{W})",
        description: "Applies policy throttling coefficients alpha_k per sector through the surrogate neural PDE operator."
      }
    ],
    pythonCode: `def simulate_policy_counterfactuals(baseline_pm25: float, baseline_no2: float):
    """
    Evaluates net pollutant reductions for Scenario A, B, and C.
    """
    # Sector share assumptions for urban domain
    traffic_pm_share = 0.35
    industry_pm_share = 0.28
    
    traffic_no2_share = 0.58
    industry_no2_share = 0.30
    
    # Scenario A: 50% diesel traffic cut
    scen_a_pm = baseline_pm25 * (traffic_pm_share * 0.50)
    scen_a_no2 = baseline_no2 * (traffic_no2_share * 0.50)
    
    # Scenario B: 10 industrial shutdown (70% industrial cut in 30km)
    scen_b_pm = baseline_pm25 * (industry_pm_share * 0.70)
    scen_b_no2 = baseline_no2 * (industry_no2_share * 0.70)
    
    # Scenario C: Combined
    scen_c_pm = scen_a_pm + scen_b_pm
    scen_c_no2 = scen_a_no2 + scen_b_no2
    
    return {
        'baseline': {'pm25': baseline_pm25, 'no2': baseline_no2},
        'scenario_A_traffic_50pct': {
            'new_pm25': round(baseline_pm25 - scen_a_pm, 1),
            'pm25_reduction_ug_m3': round(scen_a_pm, 1),
            'no2_reduction_ppb': round(scen_a_no2, 1)
        },
        'scenario_B_industry_shutdown': {
            'new_pm25': round(baseline_pm25 - scen_b_pm, 1),
            'pm25_reduction_ug_m3': round(scen_b_pm, 1),
            'no2_reduction_ppb': round(scen_b_no2, 1)
        },
        'scenario_C_combined_intervention': {
            'new_pm25': round(baseline_pm25 - scen_c_pm, 1),
            'pm25_reduction_ug_m3': round(scen_c_pm, 1),
            'no2_reduction_ppb': round(scen_c_no2, 1)
        }
    }`,
    keyArchitecturalSpecs: [
      "Sectoral source speciation weight matrix.",
      "Non-linear secondary aerosol response accounting.",
      "Socio-economic implementation feasibility scoring."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Source Speciation Decoupling",
        physicsBasis: "NO2 is primarily driven by mobile diesel combustion, whereas PM2.5 contains significant secondary sulfate contributions from industrial stacks."
      }
    ],
    defaultSimulationParams: {
      baselinePM25: 145.0,
      baselineNO2: 68.0,
      dieselCut: 50,
      industryCut: 70
    }
  },
  {
    id: "prompt-18",
    number: 18,
    categoryId: "cat5",
    category: "Category 5: Policy, Risk Communication & Automated Alert Systems",
    title: "Atmospheric Dispersion & Plume Source Apportionment",
    shortTitle: "Source Apportionment (PMF)",
    badge: "Source Apportionment / PMF",
    goal: "Assign percent contribution estimates across emission sectors (Vehicular, Biomass, Coal, Secondary Inorganics, Dust) with mass-balance sanity checks.",
    system: "You are a Source Apportionment Specialist utilizing Receptor Modeling (e.g., Positive Matrix Factorization / Chemical Mass Balance).",
    task: `Design a prompt that takes time-resolved VOC and aerosol chemical speciation data (e.g., Organic Carbon, Elemental Carbon, Nitrates, Sulfates, trace metals) and assigns percent contribution estimates to target emission sectors:
- Vehicular Exhaust
- Biomass Burning
- Industrial Coal Combustion
- Secondary Inorganics
- Crustal Dust

Demand a chemical mass-balance sanity check for all sector contribution percentages.`,
    promptTemplate: `<system>
You are a Source Apportionment Specialist utilizing Receptor Modeling (e.g., Positive Matrix Factorization / Chemical Mass Balance).
</system>

<task>
Design a prompt that takes time-resolved VOC and aerosol chemical speciation data (e.g., Organic Carbon, Elemental Carbon, Nitrates, Sulfates, trace metals) and assigns percent contribution estimates to target emission sectors:
- Vehicular Exhaust
- Biomass Burning
- Industrial Coal Combustion
- Secondary Inorganics
- Crustal Dust

Demand a chemical mass-balance sanity check for all sector contribution percentages.
</task>`,
    mathematicalFormulations: [
      {
        name: "Positive Matrix Factorization (PMF) Bilinear Receptor Model",
        latex: "x_{ij} = \\sum_{k=1}^p g_{ik} f_{kj} + e_{ij}, \\quad \\text{s.t. } g_{ik} \\ge 0, f_{kj} \\ge 0, \\quad Q = \\sum_{i=1}^n \\sum_{j=1}^m \\left( \\frac{e_{ij}}{u_{ij}} \\right)^2",
        description: "Decomposes sample species concentration x_ij into source factor contributions g_ik and source profiles f_kj."
      },
      {
        name: "Mass Balance Sanity Constraint",
        latex: "\\sum_{k=1}^p \\text{Contribution}_k \\equiv 100.0\\%, \\quad \\sum_{k} g_{ik} = PM_{2.5, \\text{gravimetric}} \\pm 5\\%",
        description: "Ensures total attributed mass matches independent gravimetric filter weight."
      }
    ],
    pythonCode: `import numpy as np

def verify_source_apportionment_mass_balance(speciation_dict: dict):
    """
    Apportions PM2.5 mass based on elemental tracers:
    OC/EC ratio, non-sea salt sulfate, nitrate, potassium (biomass tracer), silicon/calcium (dust).
    """
    total_pm25 = speciation_dict['total_pm25']
    ec = speciation_dict['elemental_carbon']
    oc = speciation_dict['organic_carbon']
    so4 = speciation_dict['sulfate']
    no3 = speciation_dict['nitrate']
    k_plus = speciation_dict['potassium']
    si_ca = speciation_dict['silicon_calcium']
    
    # Tracer-based apportionment
    biomass_mass = k_plus * 8.5
    vehicular_mass = ec * 2.2 + oc * 0.4
    industrial_mass = so4 * 1.35
    secondary_inorg_mass = no3 * 1.29
    crustal_dust_mass = si_ca * 2.14
    
    sum_mass = biomass_mass + vehicular_mass + industrial_mass + secondary_inorg_mass + crustal_dust_mass
    
    # Normalized percentages
    return {
        'total_analyzed_pm25': total_pm25,
        'apportionment_percentages': {
            'Vehicular Exhaust': round((vehicular_mass / sum_mass) * 100.0, 1),
            'Biomass Burning': round((biomass_mass / sum_mass) * 100.0, 1),
            'Industrial Coal Combustion': round((industrial_mass / sum_mass) * 100.0, 1),
            'Secondary Inorganics': round((secondary_inorg_mass / sum_mass) * 100.0, 1),
            'Crustal Dust': round((crustal_dust_mass / sum_mass) * 100.0, 1)
        },
        'mass_balance_closure_ratio': round(sum_mass / total_pm25, 3),
        'is_mass_conserved': 0.90 <= (sum_mass / total_pm25) <= 1.10
    }`,
    keyArchitecturalSpecs: [
      "EPA PMF 5.0 compatible chemical tracer mapping.",
      "Non-negative matrix constraint enforcement.",
      "Chemical mass balance (CMB) closure verification."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Elemental Carbon (EC) & Levoglucosan / K+ Tracers",
        physicsBasis: "EC uniquely identifies high-temperature fossil fuel combustion, while water-soluble potassium (K+) is the signature tracer for cellulose biomass burning."
      }
    ],
    defaultSimulationParams: {
      totalPM25: 120.0,
      ec: 8.5,
      oc: 24.0,
      sulfate: 18.0,
      nitrate: 22.0,
      potassium: 3.2
    }
  },
  {
    id: "prompt-19",
    number: 19,
    categoryId: "cat5",
    category: "Category 5: Policy, Risk Communication & Automated Alert Systems",
    title: "Real-Time Automated Model Ensembling Prompt",
    shortTitle: "Adaptive Model Ensembling",
    badge: "Ensemble / WRF-Chem",
    goal: "Dynamically calculate ensemble weights w1, w2, w3 across WRF-Chem, ST-GNN, and XGBoost based on 6-hour rolling MAE and atmospheric stability conditions.",
    system: "You are an Ensemble Learning Specialist in Environmental Forecasting.",
    task: `Write a dynamic prompt that ingests predictions from 3 distinct models:
1. Deterministic Physics Model (WRF-Chem)
2. Deep Learning Spatio-Temporal Model (GNN-LSTM)
3. Tree-Based Gradient Boosting Model (XGBoost)

Instruct the AI system to calculate dynamic weights $w_1, w_2, w_3$ for the ensemble prediction based on recent 6-hour rolling performance ($MAE$) under current atmospheric stability conditions (e.g., favoring WRF-Chem during complex weather transitions, favoring GNN-LSTM during stable patterns).`,
    promptTemplate: `<system>
You are an Ensemble Learning Specialist in Environmental Forecasting.
</system>

<task>
Write a dynamic prompt that ingests predictions from 3 distinct models:
1. Deterministic Physics Model (WRF-Chem)
2. Deep Learning Spatio-Temporal Model (GNN-LSTM)
3. Tree-Based Gradient Boosting Model (XGBoost)

Instruct the AI system to calculate dynamic weights $w_1, w_2, w_3$ for the ensemble prediction based on recent 6-hour rolling performance ($MAE$) under current atmospheric stability conditions (e.g., favoring WRF-Chem during complex weather transitions, favoring GNN-LSTM during stable patterns).
</task>`,
    mathematicalFormulations: [
      {
        name: "Stability-Conditioned Inverse-Variance Weighting",
        latex: "w_m(t) = \\frac{\\exp\\left(-\\beta \\cdot \\text{MAE}_{6h, m}\\right) \\cdot \\alpha_m(\\text{Stability})}{\\sum_{k=1}^3 \\exp\\left(-\\beta \\cdot \\text{MAE}_{6h, k}\\right) \\cdot \\alpha_k(\\text{Stability})}, \\quad \\hat{C}_{ens}(t) = \\sum_{m=1}^3 w_m(t) \\hat{C}_m(t)",
        description: "Dynamically shifts authority to deterministic physics during frontal passages and to deep ST-GNNs during persistent stagnant inversions."
      }
    ],
    pythonCode: `import numpy as np

def compute_dynamic_ensemble_weights(mae_wrf: float, mae_gnn: float, mae_xgb: float, 
                                     is_weather_transition: bool) -> dict:
    """
    Computes dynamic normalized ensemble weights for WRF-Chem, ST-GNN, and XGBoost.
    """
    # Base inverse error score
    scores = np.array([1.0 / (mae_wrf + 1e-3), 1.0 / (mae_gnn + 1e-3), 1.0 / (mae_xgb + 1e-3)])
    
    # Atmospheric stability prior adjustment
    if is_weather_transition:
        # Favor deterministic Eulerian physical model (WRF-Chem) during frontal shifts
        scores[0] *= 1.8
        scores[1] *= 0.8
        scores[2] *= 0.7
    else:
        # Favor ST-GNN during persistent diurnal patterns
        scores[0] *= 0.9
        scores[1] *= 1.6
        scores[2] *= 1.1
        
    weights = scores / np.sum(scores)
    return {
        'w_wrf_chem': round(float(weights[0]), 3),
        'w_st_gnn': round(float(weights[1]), 3),
        'w_xgboost': round(float(weights[2]), 3),
        'dominant_model': ['WRF-Chem', 'ST-GNN', 'XGBoost'][np.argmax(weights)]
    }`,
    keyArchitecturalSpecs: [
      "Softmax exponential temperature scaling on rolling 6h MAE.",
      "Meteorological regime classification gating (Frontal vs Stagnant).",
      "Conformal prediction uncertainty intervals."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Physical vs Neural Model Prior Gating",
        physicsBasis: "Data-driven GNNs excel at diurnal persistence but fail out-of-distribution during sudden unobserved meteorological frontal wind shifts where WRF numerical fluid dynamics excel."
      }
    ],
    defaultSimulationParams: {
      maeWRF: 14.5,
      maeGNN: 8.2,
      maeXGB: 11.0,
      isWeatherTransition: false
    }
  },
  {
    id: "prompt-20",
    number: 20,
    categoryId: "cat5",
    category: "Category 5: Policy, Risk Communication & Automated Alert Systems",
    title: "Automated Scientific Audit Report Generation",
    shortTitle: "Scientific Audit QA Report",
    badge: "Audit / QA & Physics",
    goal: "Construct end-of-day audit prompt ingesting actual vs predicted 24-hour grids to generate an Executive Scientific Audit detailing successes, failures, and physical root causes.",
    system: "You are a Principal Environmental Scientist auditing automated platform forecasts.",
    task: `Construct an end-of-day audit prompt that ingests actual vs. predicted values for a 24-hour period across a multi-city grid and outputs an Executive Scientific Audit.

Report Structure Required:
1. Key Forecast Successes (Regions/Pollutants with $<5\%$ error).
2. Major Failure Analysis (Deep dive into regions with $>25\%$ error or missed peak alerts).
3. Physics Analysis: Did the model fail due to unforeseen meteorological changes or unmodeled emissions?
4. Continuous Improvement Recommendations for model developers.`,
    promptTemplate: `<system>
You are a Principal Environmental Scientist auditing automated platform forecasts.
</system>

<task>
Construct an end-of-day audit prompt that ingests actual vs. predicted values for a 24-hour period across a multi-city grid and outputs an Executive Scientific Audit.

Report Structure Required:
1. Key Forecast Successes (Regions/Pollutants with $<5\%$ error).
2. Major Failure Analysis (Deep dive into regions with $>25\%$ error or missed peak alerts).
3. Physics Analysis: Did the model fail due to unforeseen meteorological changes or unmodeled emissions?
4. Continuous Improvement Recommendations for model developers.
</task>`,
    mathematicalFormulations: [
      {
        name: "Root Mean Square Error Decomposition (Bias + Variance + Dispersion)",
        latex: "\\text{RMSE}^2 = (\\bar{y}_{pred} - \\bar{y}_{true})^2 + (s_{pred} - r s_{true})^2 + (1 - r^2) s_{true}^2",
        description: "Decomposes forecast error into mean bias error (calibration), amplitude variance error, and phase timing lag."
      }
    ],
    pythonCode: `def generate_scientific_audit_report(city_results: list) -> dict:
    """
    Audits 24h forecast performance across a multi-city sensor grid.
    """
    successes = []
    failures = []
    
    for res in city_results:
        city = res['city']
        pollutant = res['pollutant']
        mape = res['mape_pct']
        
        if mape < 5.0:
            successes.append({
                'city': city,
                'pollutant': pollutant,
                'mape': mape,
                'status': 'HIGH_PRECISION_SUCCESS'
            })
        elif mape > 25.0:
            failures.append({
                'city': city,
                'pollutant': pollutant,
                'mape': mape,
                'probable_cause': res.get('root_cause', 'UNMODELED_BIOMASS_INFLUX')
            })
            
    return {
        'audit_timestamp': '2026-08-14 23:59:00',
        'overall_grid_grade': 'A-' if len(failures) == 0 else ('B' if len(failures) <= 2 else 'C'),
        'total_stations_evaluated': len(city_results),
        'high_precision_successes': successes,
        'critical_failure_analyses': failures,
        'physics_audit_summary': 'Model performed robustly on diurnal PM2.5 in urban core (MAPE 3.8%); failed in eastern perimeter due to unmodeled agricultural stubble burning and 150m boundary layer height underestimation.',
        'developer_action_items': [
            'Ingest near-real-time VIIRS thermal anomaly fire hotspots into GNN edge weights.',
            'Increase penalty on nocturnal thermal inversion stability index in PINN loss.'
        ]
    }`,
    keyArchitecturalSpecs: [
      "Rigorous Bias-Variance-Covariance spectral error breakdown.",
      "Missed-peak Critical Success Index (CSI) tracking.",
      "Automated MLOps feedback loop to retraining pipeline."
    ],
    physicalJustifications: [
      {
        featureOrComponent: "Bias-Variance-Dispersion Decomposition",
        physicsBasis: "Differentiates whether a forecast missed because winds changed speed (amplitude) vs changed direction (phase displacement)."
      }
    ],
    defaultSimulationParams: {
      gridSuccessCount: 14,
      gridFailureCount: 2,
      meanGridMAPE: 7.4
    }
  }
];
