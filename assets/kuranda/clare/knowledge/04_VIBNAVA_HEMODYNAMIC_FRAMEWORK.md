---
**File**: `VIBNAVA_HEMODYNAMIC_FRAMEWORK.md`
**Tag**: `kuranda.library.foundations.vibnava_hemodynamic_framework`
**Category**: Library/Foundations
**Source**: Working draft paste — July 31, 2026
**Installed**: 2026-08-03
**Status**: WORKING DRAFT — testable systems hypothesis
**Authority**: Delton Hyatt / Kuranda Mind & Body Institute (final domain authority)
**Author**: Delton Hyatt
**Related**:
  - `Library/Foundations/UNIFIED_TRANSFER_FUNCTION_FRAMEWORK.md`
  - `Library/Systems/WORKFLOW_VIBNAVA_Frequency_Selection_15_50Hz.md`
---

# The Math Behind VIBNAVA:
A Hemodynamic Framework for
Vibration-Induced Vasodilation

Pulsatile flow, wall shear stress, endothelial mechanotransduction, and frequency selection in the 15–50 Hz range

**Author**: Delton Hyatt  
**Date**: July 31, 2026

Figure 1. Proposed VIBNAVA hemodynamic modeling chain.

---

## Executive Summary

This paper develops a mathematical framework for testing the working hypothesis that VIBNAVA Floor and Chair stimulation can produce frequency-dependent vascular effects by transmitting mechanical oscillation into tissue, vessel walls, and blood. The hypothesized pathway is: applied vibration changes local vessel and tissue motion; that motion produces an oscillatory component of blood velocity and near-wall velocity gradient; the resulting wall shear stress is sensed by endothelial cells; and, under an appropriate mechanical exposure, endothelial nitric oxide synthase signaling increases nitric-oxide bioavailability and contributes to vasodilation.

The model does not assume that red blood cells possess a single useful resonance that directly determines nitric-oxide release. Blood is a concentrated suspension of deformable cells, and any cell-scale interaction must be embedded within bulk pulsatile hemodynamics, near-wall cell-depleted layers, vessel compliance, viscosity, geometry, and endothelial response kinetics. The defensible engineering target is therefore a frequency-dependent wall-shear exposure, not a universal blood-cell resonance.

The central result is a cascade model linking device acceleration to local wall shear stress and then to a bounded, history-dependent endothelial response. Frequency selection within 15–50 Hz becomes an optimization problem: maximize a validated shear-related biological metric while limiting excessive oscillatory reversal, peak acceleration, discomfort, pressure, heating, and other safety constraints.

## Scientific Status of the Working Theory

Exercise physiology strongly supports the general chain from increased blood flow to endothelial wall shear stress, endothelial mechanotransduction, nitric-oxide signaling, and vasodilation. Experimental vibration studies also report acute increases in skin or limb blood flow at frequencies including 30 and 50 Hz. However, evidence does not presently establish that one frequency in the 15–50 Hz band universally reproduces the vascular effects of exercise, nor that a red-blood-cell resonance is the controlling mechanism.

This paper therefore treats the VIBNAVA mechanism as a testable systems hypothesis. It identifies the measurements and equations required to distinguish among several possible contributors: direct vessel-wall motion, pressure-gradient modulation, skeletal-muscle pump effects, reflex neural responses, local metabolic effects, red-cell deformation and aggregation, and endothelial sensing of oscillatory or pulsatile shear.

## 1. Hemodynamic Variables and the Target Mechanism

### 1.1 Flow, velocity, pressure, and wall shear

Volumetric flow rate \(Q\) is the integral of axial velocity \(u\) over the vessel cross-section \(A\). Mean velocity is \(U = Q/A\). Endothelial cells do not directly sense flow rate; they experience traction at the luminal surface, commonly represented by wall shear stress.

\[
Q(t) = \int_A u(r,t)\, dA,\qquad U(t) = Q(t)/A \tag{1}
\]

\[
\tau_w(t) = \mu \left[\frac{\partial u(r,t)}{\partial r}\right]_{r=R} \tag{2}
\]

For steady, fully developed Newtonian flow in a rigid circular tube, the Poiseuille profile gives a convenient baseline:

\[
Q = \frac{\pi R^4 \Delta P}{8\mu L} \tag{3}
\]

\[
\tau_w = \frac{4\mu Q}{\pi R^3} = \frac{4\mu U}{R} \tag{4}
\]

Equation 4 shows why vessel size matters: for the same mean velocity, a smaller radius produces a larger wall shear stress. Yet the steady Poiseuille equation is insufficient for 15–50 Hz forcing because inertia and phase lag become important.

### 1.2 Endothelial nitric-oxide response

Shear-dependent endothelial signaling involves multiple mechanosensors and biochemical pathways, including calcium, phosphorylation, and endothelial nitric oxide synthase. For modeling, the downstream response can initially be represented phenomenologically rather than claiming a complete molecular mechanism.

\[
\frac{dN}{dt} = k_{\mathrm{prod}} \cdot \Phi(\tau_w, d\tau_w/dt, \mathrm{history}) - k_{\mathrm{loss}} N \tag{5}
\]

\(N\) is an NO-related state or measurable proxy, \(\Phi\) is a shear-response function, and \(k_{\mathrm{loss}}\) represents consumption or decay. The function should ultimately be fitted to measurements such as flow-mediated dilation, circulating nitrite/nitrate, endothelial assays, or another validated outcome.

## 2. Governing Equations for Vibration-Driven Blood Flow

### 2.1 Navier–Stokes foundation

For an incompressible fluid, conservation of mass and momentum are:

\[
\nabla \cdot \mathbf{u} = 0 \tag{6}
\]

\[
\rho\left(\frac{\partial \mathbf{u}}{\partial t} + \mathbf{u}\cdot\nabla\mathbf{u}\right) = -\nabla p + \mu\nabla^2\mathbf{u} + \rho\mathbf{b} \tag{7}
\]

The body-force term \(\mathbf{b}\) can represent acceleration transmitted from the VIBNAVA system. In a frame accelerating with the local tissue, harmonic acceleration contributes an effective oscillatory pressure gradient. Vessel-wall motion enters through moving-boundary conditions.

\[
a_d(t) = A_a \sin(\omega t + \phi_a) \tag{8}
\]

\[
-\frac{\partial p_{\mathrm{eff}}}{\partial z} = -\frac{\partial p_{\mathrm{cardiac}}}{\partial z} + \rho a_{\mathrm{parallel}}(t) + g_{\mathrm{wall}}(t) \tag{9}
\]

Only the component of acceleration aligned with the vessel axis directly enters this simplified axial pressure-gradient expression. Transverse acceleration can still matter through vessel deformation, curvature, secondary flow, tissue coupling, and orientation-dependent motion.

### 2.2 Womersley pulsatile-flow solution

For harmonic pressure-driven flow in a rigid circular tube, the classical Womersley solution describes the frequency-dependent velocity profile. The key dimensionless parameter is the Womersley number:

\[
\alpha = R\sqrt{\frac{\omega\rho}{\mu}} = R\sqrt{\frac{\omega}{\nu}} \tag{10}
\]

At low \(\alpha\), viscous effects dominate across the lumen and the velocity profile remains close to parabolic. At high \(\alpha\), inertia dominates in the core, the profile becomes flatter, and strong phase-dependent gradients form near the wall. Thus frequency cannot be interpreted without vessel radius and viscosity.

Figure 2. Approximate Womersley number for representative vessel radii using blood-like density and viscosity. The shaded region is 15–50 Hz.

For a harmonic pressure gradient \(G e^{j\omega t}\), the complex axial velocity profile can be written:

\[
\hat{u}(r,\omega) = \frac{G}{j\omega\rho}\left\{1 - \frac{J_0\!\left(j^{3/2}\alpha\, r/R\right)}{J_0\!\left(j^{3/2}\alpha\right)}\right\} \tag{11}
\]

\(J_0\) is the Bessel function of the first kind. The complex wall-shear amplitude follows from the radial derivative:

\[
\hat{\tau}_w(\omega) = \mu\left[\frac{\partial\hat{u}}{\partial r}\right]_{r=R} \tag{12}
\]

The complex notation carries both amplitude and phase. In practice, equation 12 can be evaluated numerically or wall shear can be reconstructed from measured pulsatile velocity waveforms using Womersley-based methods.

### 2.3 Compliant vessel extension

Real vessels expand and contract. A first-order wall model relates transmural pressure \(p_{\mathrm{tm}}\) to radius change \(\Delta R\) through compliance \(C_R\), with viscous wall loss \(c_R\):

\[
m_R\,\ddot{\Delta R} + c_R\,\dot{\Delta R} + k_R\,\Delta R = p_{\mathrm{tm}}(t)\cdot 2\pi R L \tag{13}
\]

\[
C_R(\omega) = \frac{\widehat{\Delta R}(\omega)}{\hat{p}_{\mathrm{tm}}(\omega)} \tag{14}
\]

This wall equation resembles a mass-spring-damper mathematically, but here it is subordinate to fluid–structure interaction. The relevant system is not merely a solid oscillator or a hydraulic circuit; it is coupled blood, vessel wall, and surrounding tissue.

## 3. Blood as a Cellular Suspension

### 3.1 Why a single red-cell resonance is unlikely to be sufficient

Blood is non-Newtonian at low shear rates and in small vessels because red cells deform, orient, aggregate, and migrate away from the wall. The effective viscosity \(\mu_{\mathrm{eff}}\) can depend on shear rate \(\dot{\gamma}\), hematocrit \(H\), vessel diameter \(D\), and temperature.

\[
\mu_{\mathrm{eff}} = \mu_{\mathrm{eff}}(\dot{\gamma}, H, D, T) \tag{15}
\]

\[
\dot{\gamma}_w(t) \approx \frac{|\tau_w(t)|}{\mu_{\mathrm{eff}}} \tag{16}
\]

Red-cell deformation may influence dissipation and microscale shear, but the endothelial wall is separated from most red cells by a near-wall cell-depleted plasma layer in microvessels. Consequently, the phrase “blood-cell shear against the endothelium” should be used cautiously. The measurable endothelial stimulus is local fluid traction and associated transport, potentially modified by cell-scale rheology.

### 3.2 Candidate microhydrodynamic mechanisms

| Candidate mechanism | Mathematical signature | Measurement |
|---|---|---|
| Bulk oscillatory flow | Harmonic \(Q(t)\), \(U(t)\), and \(\tau_w(t)\) | Doppler ultrasound, phase-contrast MRI, flow probes |
| Vessel-wall pumping | \(\Delta R(t)\), wall velocity, pressure-flow phase | Ultrasound wall tracking, pressure sensors |
| Muscle-pump contribution | Intermittent venous compression and valve-dependent net flow | EMG, venous Doppler, limb-volume change |
| Red-cell rheology | Frequency-dependent \(\mu_{\mathrm{eff}}\), aggregation, deformation | Rheometry, microfluidics, high-speed microscopy |
| Endothelial response | eNOS/NO metric versus \(\tau_w\) amplitude, mean, reversal, and rate | Cell assay, biomarkers, flow-mediated dilation |

## 4. From Device Frequency to Wall Shear

### 4.1 Cascaded transfer functions

The device frequency is not identical to the vascular stimulus. Each anatomical layer modifies amplitude and phase. Let \(A_d(\omega)\) be the commanded acceleration spectrum, \(H_B\) the body/tissue transmission, \(H_W\) the vessel-wall response, and \(H_F\) the fluid-dynamic mapping from wall motion and pressure gradient to wall shear.

\[
\hat{\tau}_w(\omega) = H_F(j\omega;\theta_F)\, H_W(j\omega;\theta_W)\, H_B(j\omega;\theta_B)\, \hat{A}_d(\omega) \tag{17}
\]

The parameter vectors include posture, contact location, preload, tissue stiffness, vessel depth, orientation, radius, viscosity, wall compliance, and baseline cardiac flow. A frequency that performs well in one anatomical region or individual need not perform well in another.

Figure 3. Illustrative cascade. A candidate optimum may occur where transmission and shear-rate gain overlap; this is not an empirical VIBNAVA curve.

### 4.2 Superposition with the cardiac waveform

Vibration is superimposed on an existing pulsatile circulation. In a linear approximation:

\[
\tau_w(t) = \tau_{\mathrm{cardiac}}(t) + \tau_{\mathrm{vib}}(t) \tag{18}
\]

In a nonlinear or compliant system, cross-frequency interactions and amplitude-dependent parameters may occur. The experiment must therefore compare vibration-on and vibration-off conditions at the same cardiac and postural state, preferably using phase-resolved measurements.

### 4.3 Directionality and oscillatory shear

Not all shear is equivalent. Sustained, predominantly unidirectional shear is commonly associated with endothelial homeostasis, whereas strongly reversing or disturbed shear can activate different signaling programs. A useful frequency metric must therefore incorporate direction and not simply maximize RMS shear.

\[
\mathrm{OSI} = 0.5\left[1 - \frac{\left|\int_0^T \tau_w(t)\,dt\right|}{\int_0^T |\tau_w(t)|\,dt}\right] \tag{19}
\]

OSI is the oscillatory shear index. It ranges from 0 for purely unidirectional shear to 0.5 for fully reversing shear with zero mean. Additional descriptors include time-averaged wall shear stress:

\[
\mathrm{TAWSS} = \frac{1}{T}\int_0^T |\tau_w(t)|\,dt \tag{20}
\]

For VIBNAVA, a plausible objective is not maximal OSI. Rather, one may seek an increase in useful pulsatile shear exposure without generating excessive reversal or disturbed-flow signatures.

## 5. Mathematical Definition of Exercise Mimicry

To compare VIBNAVA with cardiovascular exercise, define a vector of hemodynamic features rather than a single flow value:

\[
\mathbf{h} = [\bar{Q},\bar{U},\mathrm{TAWSS},\tau_{\mathrm{peak}},\mathrm{RMS}(\tau_{\mathrm{vib}}),\mathrm{OSI},(d\tau/dt)_{\mathrm{RMS}},\Delta R_{\mathrm{RMS}},\mathrm{duration}] \tag{21}
\]

Let \(\mathbf{h}_{\mathrm{ex}}\) be the feature vector measured during a target exercise condition and \(\mathbf{h}_{\mathrm{vib}}(f,A,\mathrm{posture})\) the vector during VIBNAVA stimulation. A weighted mismatch function is:

\[
J_{\mathrm{mimic}}(f,A) = [\mathbf{h}_{\mathrm{vib}}(f,A) - \mathbf{h}_{\mathrm{ex}}]^{\mathsf{T}} W [\mathbf{h}_{\mathrm{vib}}(f,A) - \mathbf{h}_{\mathrm{ex}}] \tag{22}
\]

\(W\) weights features according to physiological relevance and measurement confidence. The frequency-amplitude pair that best mimics the target condition minimizes \(J_{\mathrm{mimic}}\), subject to safety constraints.

\[
(f^*,A^*) = \arg\min_{15\le f\le 50,\,A} J_{\mathrm{mimic}}(f,A) \tag{23}
\]

This is more defensible than selecting a frequency solely by observed blood-flow increase. It explicitly asks whether the temporal and directional shear environment resembles the exercise reference.

## 6. Shear-to-Nitric-Oxide Model

### 6.1 Static phenomenological response

A logistic or Hill-type response can represent a bounded increase in an NO proxy as a function of a composite shear stimulus \(S\):

\[
S = w_1\cdot\mathrm{TAWSS} + w_2\cdot\mathrm{RMS}(\tau_{\mathrm{vib}}) + w_3\cdot\mathrm{RMS}(d\tau_w/dt) - w_4\cdot\mathrm{OSI} \tag{24}
\]

\[
\Phi(S) = \Phi_{\min} + \frac{\Phi_{\max}-\Phi_{\min}}{1 + \exp\!\big(-k(S-S_{50})\big)} \tag{25}
\]

Figure 4. Example bounded response. Threshold and slope must be fitted; the curve is conceptual.

The negative OSI term is a hypothesis reflecting the possibility that highly reversing shear is not equivalent to exercise-like unidirectional flow. Its sign and weight must be tested rather than assumed.

### 6.2 Dynamic response and adaptation

\[
\frac{dE}{dt} = \frac{\Phi(S(t)) - E}{\tau_E} \tag{26}
\]

\[
\frac{dN}{dt} = k_E E - k_N N \tag{27}
\]

\(E\) represents endothelial activation and \(N\) an NO-related state. These equations allow delayed onset, accumulation over time, and recovery after stimulation. Additional states can represent desensitization, substrate limitation, oxidative scavenging, or autonomic effects if data justify them.

## 7. Frequency-Selection Protocol for 15–50 Hz

The model implies that the correct frequency must be identified empirically for a defined anatomical site, posture, device configuration, amplitude, and outcome. A practical protocol is:

1. **Input characterization.** Measure platform or chair acceleration, displacement, force, and harmonic distortion at each candidate frequency.
2. **Transmission mapping.** Measure acceleration at the skin and near the vessel; estimate \(H_B(j\omega)\) and coherence.
3. **Vessel response.** Track vessel diameter and wall motion; estimate \(H_W(j\omega)\).
4. **Flow measurement.** Acquire synchronized blood-velocity waveforms with Doppler ultrasound or another validated method.
5. **Wall-shear reconstruction.** Estimate \(\tau_w(t)\) using geometry-specific Womersley or CFD methods rather than steady Poiseuille assumptions.
6. **Exercise reference.** Measure the same feature vector during a defined exercise intensity or muscle-pump maneuver.
7. **Biological validation.** Measure an NO-related or endothelial outcome and fit the dynamic response model.
8. **Optimization and validation.** Select \(f\) and amplitude using equations 22–23, then test the selected condition in held-out participants or sessions.

### 7.1 Recommended excitation design

A stepped-sine sweep at 15, 20, 25, 30, 35, 40, 45, and 50 Hz is straightforward but may be sensitive to drift. A randomized multisine or chirp can estimate the transfer function more efficiently, provided the waveform remains within comfort and safety limits and the analysis separates harmonics and nonlinear distortion.

\[
\hat{H}_{\tau a}(j\omega) = \frac{S_{\tau a}(\omega)}{S_{aa}(\omega)} \tag{28}
\]

\(S_{\tau a}\) is the cross-spectrum between estimated wall shear and device acceleration; \(S_{aa}\) is the acceleration autospectrum. Magnitude-squared coherence indicates whether a linear frequency-domain relationship is reliable:

\[
\gamma^2(\omega) = \frac{|S_{\tau a}(\omega)|^2}{S_{\tau\tau}(\omega)\,S_{aa}(\omega)} \tag{29}
\]

## 8. A Unified VIBNAVA Hemodynamic Equation

The full working model can be expressed compactly as:

\[
\tau_w(t;f,A,\theta) = \mathcal{F}^{-1}\{H_F H_W H_B \hat{A}_d\} + \tau_{\mathrm{cardiac}}(t) \tag{30}
\]

\[
S(t) = \Psi[\tau_w(t), d\tau_w/dt, \mathrm{OSI}, \mathrm{TAWSS}, \mathrm{history}] \tag{31}
\]

\[
\frac{dN}{dt} = k_{\mathrm{prod}}\Phi(S(t)) - k_{\mathrm{loss}} N \tag{32}
\]

Equation 30 maps the external vibration into local wall shear. Equation 31 reduces the shear waveform to a biologically motivated stimulus. Equation 32 predicts the temporal NO-related response. Together they provide a falsifiable bridge from device settings to vascular outcome.

## 9. Testable Hypotheses

- Within 15–50 Hz, local wall-shear gain will show participant- and site-specific peaks that do not necessarily coincide with peak platform acceleration.
- Frequency-dependent increases in skin or limb blood flow will be better predicted by reconstructed wall shear and vessel-wall motion than by device frequency alone.
- A VIBNAVA condition selected to minimize exercise-mimicry mismatch will produce a larger endothelial or NO-related response than a frequency selected solely from external acceleration.
- Prestress, posture, vessel orientation, and tissue stiffness will shift the apparent optimal frequency.
- Red-cell rheological variables may modify the transfer function, but a cell-resonance model will not outperform bulk hemodynamic and wall-shear models unless direct microfluidic evidence supports it.
- Excessive oscillatory reversal will not improve—and may reduce—the desired endothelial response despite increasing RMS shear.

## 10. Limitations and Safety Boundaries

This framework is not a clinical dosing rule. The 15–50 Hz range includes conditions that may create different neuromuscular, vestibular, vascular, and discomfort responses depending on amplitude, posture, duration, and health status. Resonance can concentrate mechanical energy and is not inherently therapeutic.

Steady Poiseuille formulas, rigid-wall Womersley theory, and lumped wall models are approximations. Patient-specific geometry, branching, curvature, valves, vessel compliance, non-Newtonian blood behavior, and active vascular tone may require computational fluid dynamics or fluid–structure interaction. Any human study should use appropriate medical oversight, exclusion criteria, adverse-event monitoring, and ethics and regulatory review.

## Conclusion

The mathematics of VIBNAVA-induced vasodilation is most naturally framed as harmonic, pulsatile hemodynamics coupled to endothelial mechanotransduction. The relevant chain is not frequency directly to nitric oxide. It is device waveform to body transmission, vessel-wall motion and pressure modulation, pulsatile velocity profile, wall shear stress, and finally a state-dependent endothelial response.

A candidate frequency in the 15–50 Hz band can therefore be determined only after measuring or estimating the transfer functions and comparing the resulting shear environment with a defined exercise reference. This framework converts the working theory into a quantitative experimental program while preserving the distinction between established physiology and VIBNAVA-specific hypotheses.

## Glossary of Symbols

| Symbol | Meaning |
|---|---|
| \(A_d\), \(a_d\) | Device vibration amplitude and acceleration |
| \(H_B\) | Body/tissue transmission transfer function |
| \(H_W\) | Vessel-wall transfer function |
| \(H_F\) | Fluid-dynamic mapping to wall shear |
| \(Q\), \(U\) | Volumetric flow and mean velocity |
| \(R\), \(D\) | Vessel radius and diameter |
| \(\rho\), \(\mu\), \(\nu\) | Density, dynamic viscosity, and kinematic viscosity |
| \(\alpha\) | Womersley number |
| \(\tau_w\) | Wall shear stress |
| TAWSS | Time-averaged wall shear stress |
| OSI | Oscillatory shear index |
| \(N\) | NO-related model state |
| \(E\) | Endothelial activation state |
| \(J_{\mathrm{mimic}}\) | Weighted exercise-mimicry mismatch |

## Selected References

1. Muskat JC, et al. Method for estimating pulsatile wall shear stress from one-dimensional velocity waveforms using Womersley-derived profiles. Physiological Reports. 2023.
2. Cai H, et al. Oscillatory shear stress upregulation of endothelial nitric oxide synthase requires intracellular hydrogen peroxide and CaMKII. Journal of Molecular and Cellular Cardiology. 2004.
3. Helmlinger G, et al. Pulsatile and steady flow-induced calcium oscillations in single cultured endothelial cells. Journal of Vascular Research. 1996.
4. Paniagua OA, et al. Role of endothelial nitric oxide in shear stress-induced vasodilation of human microvasculature. Circulation. 2001.
5. White CR, et al. Extracellular signal-regulated kinase activation and endothelin-1 production in response to fluid vibration in human endothelial cells. Journal of Applied Physiology. 2004.
6. Lohman EB, et al. The effect of 30 Hz versus 50 Hz passive vibration and duration on skin blood flow in the lower extremity. Medical Science Monitor. 2007.
7. Stewart JM, et al. The effect of whole-body vibration on lower-extremity skin blood flow in normal subjects. Medical Science Monitor. 2007.
8. Carrara E, et al. Effects of high-frequency mechanical stimuli on flow-related endothelial function. 2024.
9. Souilhol C, et al. Endothelial responses to shear stress in atherosclerosis. Nature Reviews Cardiology. 2020.
10. Classical foundations: incompressible Navier–Stokes equations, Poiseuille flow, Womersley pulsatile-flow theory, spectral transfer-function estimation, and fluid–structure interaction.

---

## Kuranda Library Notes

- **Author lock**: Delton Hyatt.
- **Scientific position lock**: testable systems hypothesis; not a clinical dosing rule; not a validated universal frequency law.
- **Mechanism lock**: device waveform → body transmission → vessel-wall motion/pressure modulation → pulsatile velocity → wall shear stress → state-dependent endothelial / NO response.
- **Rejected simplification lock**: do not treat a single red-blood-cell resonance as the controlling mechanism unless direct evidence supports it.
- **Engineering target lock**: frequency-dependent wall-shear exposure, not universal blood-cell resonance.
- **Frequency band lock**: candidate optimization range 15–50 Hz; optimum is site-, posture-, person-, and configuration-specific.
- **Metric lock**: use TAWSS, RMS vibration shear, shear-rate content, and OSI directionality — not frequency or blood-flow increase alone.
- **Exercise-mimicry lock**: minimize weighted hemodynamic feature mismatch \(J_{\mathrm{mimic}}\) rather than maximizing a single flow number.
- **Safety lock**: resonance is not inherently therapeutic; human studies require medical oversight, exclusion criteria, adverse-event monitoring, and ethics/regulatory review.
- **Figure assets**: captions retained; original figure image files not yet installed in `assets/`.
- **Cross-link**: general tissue transfer-function cascade in `UNIFIED_TRANSFER_FUNCTION_FRAMEWORK.md`; this paper specializes that cascade to VIBNAVA hemodynamics and endothelial response.
