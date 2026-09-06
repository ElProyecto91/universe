// src/components/FiscalExperto.tsx
// ============================================================
// UNIVERSE — Información fiscal para expertos por países
// Información orientativa — no constituye asesoramiento fiscal
// ============================================================

import { useState } from 'react'

interface PaisFiscal {
  pais: string
  bandera: string
  region: string
  impuestoRenta: string
  iva: string
  umbralIva: string
  registroAutonomo: string
  periodicidad: string
  notas: string
  recurso: string
}

const PAISES_FISCALES: PaisFiscal[] = [
  // ── EUROPA ───────────────────────────────────────────────
  {
    pais: 'España', bandera: '🇪🇸', region: 'Europa',
    impuestoRenta: 'IRPF 19–47% según tramos. Retención 15% si trabajas para empresas españolas.',
    iva: '21% en servicios digitales',
    umbralIva: 'Desde el primer euro si estás dado de alta como autónomo',
    registroAutonomo: 'Modelo 036/037 en Hacienda. Cuota autónomo desde ~€80/mes (tarifa plana primer año).',
    periodicidad: 'IVA trimestral (mod. 303). IRPF trimestral (mod. 130). Renta anual.',
    notas: 'Si ingresas menos de €1.000/año como actividad secundaria, puede considerarse rendimiento del trabajo. Consulta con un gestor.',
    recurso: 'agenciatributaria.gob.es',
  },
  {
    pais: 'Alemania', bandera: '🇩🇪', region: 'Europa',
    impuestoRenta: 'Einkommensteuer 14–45% según tramos. Exento hasta €11.784/año.',
    iva: 'Mehrwertsteuer 19%',
    umbralIva: 'Kleinunternehmerregelung: exento si ingresos < €22.000/año',
    registroAutonomo: 'Registro como Freiberufler (libre) o Gewerbetreibender (comercio) en Finanzamt.',
    periodicidad: 'Declaración anual (Einkommensteuererklärung). IVA mensual o trimestral si superas umbral.',
    notas: 'Las actividades espirituales suelen clasificarse como "sonstige freiberufliche Tätigkeiten". La Kleinunternehmerregelung evita el IVA hasta €22.000.',
    recurso: 'bundesfinanzministerium.de',
  },
  {
    pais: 'Francia', bandera: '🇫🇷', region: 'Europa',
    impuestoRenta: 'Impôt sur le revenu 0–45% según tramos.',
    iva: 'TVA 20%',
    umbralIva: 'Micro-entrepreneur: exento si ingresos < €36.800/año en servicios',
    registroAutonomo: 'Auto-entrepreneur/Micro-entrepreneur en URSSAF. Simple y online.',
    periodicidad: 'Declaración mensual o trimestral de ingresos. Cotizaciones sociales incluidas (~22%).',
    notas: 'El régimen micro-entrepreneur es muy favorable: pagas un % fijo sobre ingresos (~22% para servicios) sin IVA hasta el umbral.',
    recurso: 'autoentrepreneur.urssaf.fr',
  },
  {
    pais: 'Italia', bandera: '🇮🇹', region: 'Europa',
    impuestoRenta: 'IRPEF 23–43% según tramos.',
    iva: 'IVA 22%',
    umbralIva: 'Regime forfettario: exento hasta €85.000/año (impuesto fijo 15% o 5% primeros 5 años)',
    registroAutonomo: 'Apertura Partita IVA en Agenzia delle Entrate.',
    periodicidad: 'Declaración anual (730 o Redditi). Acconti de impuesto en noviembre.',
    notas: 'El Regime Forfettario es muy ventajoso: impuesto fijo del 15% (5% primeros 5 años) sin IVA hasta €85.000.',
    recurso: 'agenziaentrate.gov.it',
  },
  {
    pais: 'Portugal', bandera: '🇵🇹', region: 'Europa',
    impuestoRenta: 'IRS 14,5–53% según tramos. Regime Simples para profesionales.',
    iva: 'IVA 23%',
    umbralIva: 'Exento si ingresos < €13.500/año (pequeñas atividades)',
    registroAutonomo: 'Recibos verdes (facturas electrónicas) en Portal das Finanças.',
    periodicidad: 'IVA trimestral. IRS anual (abril). Retenções na fonte si trabajas para empresas.',
    notas: 'Portugal tiene el Non-Habitual Resident (NHR) para extranjeros: tipo fijo 20% durante 10 años.',
    recurso: 'portaldasfinancas.gov.pt',
  },
  {
    pais: 'Países Bajos', bandera: '🇳🇱', region: 'Europa',
    impuestoRenta: 'Inkomstenbelasting 36,97–49,5% según tramos.',
    iva: 'BTW 21%',
    umbralIva: 'Kleineondernemersregeling (KOR): exento hasta €20.000/año',
    registroAutonomo: 'Registro en KVK (Kamer van Koophandel) como ZZP (zelfstandige zonder personeel).',
    periodicidad: 'BTW trimestral. IB anual (antes del 1 mayo).',
    notas: 'Como ZZP tienes deducciones importantes: zelfstandigenaftrek (~€3.750) y MKB-winstvrijstelling (14%). Cotizaciones sociales opcionales pero recomendadas.',
    recurso: 'belastingdienst.nl',
  },
  {
    pais: 'Bélgica', bandera: '🇧🇪', region: 'Europa',
    impuestoRenta: 'IPP 25–50% según tramos. Más cotizaciones sociales (~20%).',
    iva: 'TVA/BTW 21%',
    umbralIva: 'Franchisé en base à la franchise: exento hasta €25.000/año',
    registroAutonomo: 'Número BCE en Banque-Carrefour des Entreprises. Caisse d\'assurances sociales obligatoria.',
    periodicidad: 'TVA trimestral. IPP anual.',
    notas: 'Bélgica tiene altas cotizaciones sociales para autónomos (~20% de ingresos netos). El primer año aplica tarifa reducida.',
    recurso: 'belgium.be/fr/finances',
  },
  {
    pais: 'Polonia', bandera: '🇵🇱', region: 'Europa',
    impuestoRenta: 'PIT 12–32% o impuesto lineal 19% (a elegir).',
    iva: 'VAT 23%',
    umbralIva: 'Zwolnienie: exento hasta 200.000 PLN/año (~€46.000)',
    registroAutonomo: 'Registro en CEIDG (Centralna Ewidencja i Informacja o Działalności Gospodarczej).',
    periodicidad: 'VAT mensual o trimestral. PIT mensual (zaliczki). Roczne rozliczenie anual.',
    notas: 'El impuesto lineal del 19% es popular entre freelancers con ingresos altos. Ryczałt (impuesto forfetario) disponible para ciertas actividades.',
    recurso: 'podatki.gov.pl',
  },
  {
    pais: 'Suecia', bandera: '🇸🇪', region: 'Europa',
    impuestoRenta: 'Inkomstskatt ~30% municipal + estatal si superas ~600.000 SEK.',
    iva: 'Moms 25%',
    umbralIva: 'Exento hasta 80.000 SEK/año (~€7.000)',
    registroAutonomo: 'Registro en Skatteverket como enskild firma o AB (sociedad).',
    periodicidad: 'Moms mensual/trimestral. Deklaration anual.',
    notas: 'Suecia tiene altas cotizaciones sociales (~28,97% sobre ingresos brutos). La enskild firma es la forma más simple.',
    recurso: 'skatteverket.se',
  },
  {
    pais: 'Noruega', bandera: '🇳🇴', region: 'Europa',
    impuestoRenta: 'Inntektsskatt 22% base + trygdeavgift 7,9% + toppskatt si superas umbral.',
    iva: 'MVA 25%',
    umbralIva: 'Exento hasta 50.000 NOK/año (~€4.400)',
    registroAutonomo: 'Registro en Brønnøysundregistrene como enkeltpersonforetak.',
    periodicidad: 'MVA bimestral. Skattemelding anual.',
    notas: 'El umbral de IVA es muy bajo. La mayoría de freelancers deben registrarse en cuanto superan 50.000 NOK.',
    recurso: 'skatteetaten.no',
  },
  {
    pais: 'Dinamarca', bandera: '🇩🇰', region: 'Europa',
    impuestoRenta: 'Indkomstskat ~55% combinado (municipal + estatal) sobre ingresos altos.',
    iva: 'MOMS 25%',
    umbralIva: 'Exento hasta 50.000 DKK/año (~€6.700)',
    registroAutonomo: 'Registro como enkeltmandsvirksomhed en Erhvervsstyrelsen.',
    periodicidad: 'MOMS trimestral. Selvangivelse anual.',
    notas: 'Dinamarca tiene los impuestos más altos de Europa. Sin embargo, los servicios públicos son extensos. Considera revisar si conviene constituir ApS (sociedad limitada).',
    recurso: 'skat.dk',
  },
  {
    pais: 'Finlandia', bandera: '🇫🇮', region: 'Europa',
    impuestoRenta: 'Ansiotulovero ~51% combinado para ingresos altos.',
    iva: 'ALV 25,5%',
    umbralIva: 'Exento hasta €15.000/año',
    registroAutonomo: 'Registro en Patentti- ja rekisterihallitus como toiminimi.',
    periodicidad: 'ALV mensual/trimestral/anual según ingresos. Veroilmoitus anual.',
    notas: 'El IVA subió al 25,5% en septiembre 2024. El umbral de €15.000 aplica con devolución parcial entre €10.000-€15.000.',
    recurso: 'vero.fi',
  },
  {
    pais: 'Austria', bandera: '🇦🇹', region: 'Europa',
    impuestoRenta: 'ESt 20–55% según tramos.',
    iva: 'USt 20%',
    umbralIva: 'Kleinunternehmerregelung: exento hasta €42.000/año',
    registroAutonomo: 'Alta en Finanzamt como Einzelunternehmer.',
    periodicidad: 'USt trimestral. ESt anual.',
    notas: 'El umbral de €42.000 para la Kleinunternehmerregelung es uno de los más altos de Europa. Cotizaciones SVS (Sozialversicherung der Selbständigen) obligatorias.',
    recurso: 'bmf.gv.at',
  },
  {
    pais: 'Suiza', bandera: '🇨🇭', region: 'Europa',
    impuestoRenta: 'Federal ~11,5% + cantonal variable. Total ~20–40% según cantón.',
    iva: 'MWST/TVA 8,1%',
    umbralIva: 'Exento hasta CHF 100.000/año (~€104.000)',
    registroAutonomo: 'Registro en AHV (Ausgleichskasse) para contribuciones sociales.',
    periodicidad: 'IVA trimestral. Impuesto anual.',
    notas: 'Suiza no es UE. IVA bajo y umbral muy alto. Los cantones tienen impuestos muy variables (Zug y Schwyz son los más bajos). No existe "autónomo" formal — simplemente declaras ingresos.',
    recurso: 'estv.admin.ch',
  },
  {
    pais: 'Reino Unido', bandera: '🇬🇧', region: 'Europa',
    impuestoRenta: 'Income Tax 20–45%. Personal allowance £12.570/año exenta.',
    iva: 'VAT 20%',
    umbralIva: 'Obligatorio registrarse en HMRC si superas £90.000/año',
    registroAutonomo: 'Self-assessment en HMRC. National Insurance Class 2 y Class 4.',
    periodicidad: 'Self-assessment anual (31 enero). Pagos a cuenta enero y julio.',
    notas: 'Post-Brexit, UK opera su propio sistema VAT separado de la UE. El umbral de £90.000 es uno de los más altos del mundo. Making Tax Digital (MTD) obligatorio.',
    recurso: 'gov.uk/self-employed-national-insurance-rates',
  },
  {
    pais: 'Irlanda', bandera: '🇮🇪', region: 'Europa',
    impuestoRenta: 'Income Tax 20–40% + USC 0,5–8% + PRSI 4%.',
    iva: 'VAT 23%',
    umbralIva: 'Obligatorio si superas €40.000/año en servicios',
    registroAutonomo: 'Registro en Revenue como sole trader. PPS number necesario.',
    periodicidad: 'VAT bimestral. Income Tax anual (31 oct).',
    notas: 'Irlanda tiene un sistema fiscal complejo pero favorable para empresas. Como sole trader, los primeros €40.000 en servicios están bajo el umbral de VAT.',
    recurso: 'revenue.ie',
  },
  {
    pais: 'Grecia', bandera: '🇬🇷', region: 'Europa',
    impuestoRenta: 'Φόρος εισοδήματος 9–44% según tramos.',
    iva: 'ΦΠΑ 24%',
    umbralIva: 'Exento hasta €10.000/año',
    registroAutonomo: 'AFM (Αριθμός Φορολογικού Μητρώου) en AADE.',
    periodicidad: 'ΦΠΑ trimestral. Declaración anual.',
    notas: 'Grecia tiene el programa "ψηφιακός νομάδας" (nómada digital) con condiciones especiales. Los autónomos pagan cotizaciones EFKA (~14% mínimo).',
    recurso: 'aade.gr',
  },
  {
    pais: 'Países Bajos', bandera: '🇳🇱', region: 'Europa',
    impuestoRenta: 'Inkomstenbelasting 36,97–49,5% según tramos.',
    iva: 'BTW 21%',
    umbralIva: 'KOR (Kleineondernemersregeling): exento hasta €20.000/año',
    registroAutonomo: 'Registro en KVK como ZZP.',
    periodicidad: 'BTW trimestral. IB anual.',
    notas: 'Los ZZP tienen importantes deducciones: zelfstandigenaftrek y startersaftrek. Ojo: el gobierno está limitando el trabajo ZZP para algunas profesiones.',
    recurso: 'belastingdienst.nl',
  },
  {
    pais: 'República Checa', bandera: '🇨🇿', region: 'Europa',
    impuestoRenta: 'Daň z příjmů 15% (23% sobre 48x salario medio).',
    iva: 'DPH 21%',
    umbralIva: 'Exento hasta CZK 2.000.000/año (~€80.000)',
    registroAutonomo: 'OSVČ (Osoba samostatně výdělečně činná) en živnostenský úřad.',
    periodicidad: 'DPH mensual/trimestral. Daňové přiznání anual (1 abril).',
    notas: 'Muy favorable para freelancers. Puedes deducir el 60% de ingresos como gastos sin justificación (výdajový paušál). Cotizaciones sociales y de salud obligatorias.',
    recurso: 'financnisprava.cz',
  },
  // ── AMÉRICAS ─────────────────────────────────────────────
  {
    pais: 'Estados Unidos', bandera: '🇺🇸', region: 'Américas',
    impuestoRenta: 'Federal 10–37% según tramos. + State tax variable (0–13,3% según estado).',
    iva: 'Sin IVA federal. Sales tax estatal variable (0–10%).',
    umbralIva: 'Sin umbral federal. Cada estado tiene sus propias reglas.',
    registroAutonomo: 'No existe registro formal. Solo declaras en Schedule C (Form 1040). EIN opcional.',
    periodicidad: 'Pagos trimestrales estimados (15 ene, abr, jun, sep). Declaración anual 15 abril.',
    notas: 'Self-employment tax adicional del 15,3% (Social Security + Medicare). FEIE hasta $132.900 si vives fuera de EEUU. Formulario W-9 para clientes US. W-8BEN para no residentes.',
    recurso: 'irs.gov/self-employed',
  },
  {
    pais: 'Canadá', bandera: '🇨🇦', region: 'Américas',
    impuestoRenta: 'Federal 15–33% + provincial variable. Combinado ~40–54% en tramos altos.',
    iva: 'GST/HST 5–15% según provincia',
    umbralIva: 'Obligatorio registrarse en CRA si superas CAD $30.000/año',
    registroAutonomo: 'No existe registro formal. Declaras ingresos en T1 General como self-employed.',
    periodicidad: 'Pagos trimestrales si debes más de $3.000. Declaración anual 15 junio para self-employed.',
    notas: 'CPP (Canada Pension Plan) contributions obligatorias. Las provincias tienen impuestos muy diferentes (Quebec el más alto). GST/HST se registra en CRA online.',
    recurso: 'canada.ca/en/revenue-agency',
  },
  {
    pais: 'México', bandera: '🇲🇽', region: 'Américas',
    impuestoRenta: 'ISR 1,92–35% según tramos.',
    iva: 'IVA 16% (0% en zona fronteriza norte)',
    umbralIva: 'RIF exento hasta $300.000 MXN/año. Régimen general desde el primer peso.',
    registroAutonomo: 'Alta en el SAT como persona física. RFC obligatorio. Plataformas tecnológicas: régimen especial.',
    periodicidad: 'Declaraciones mensuales (17 de cada mes). Declaración anual abril.',
    notas: 'Desde 2020, las plataformas digitales deben retener ISR e IVA directamente. UNIVERSE puede tener obligación de retención para usuarios mexicanos. Consulta con el SAT.',
    recurso: 'sat.gob.mx',
  },
  {
    pais: 'Argentina', bandera: '🇦🇷', region: 'Américas',
    impuestoRenta: 'Impuesto a las Ganancias: exento hasta $1.800.000 ARS/mes (variable por inflación).',
    iva: 'IVA 21%',
    umbralIva: 'Monotributo hasta ~$68.000.000 ARS/año incluye IVA. Sobre ese umbral, régimen general.',
    registroAutonomo: 'Monotributo en AFIP (formulario 184). Categoría según ingresos anuales.',
    periodicidad: 'Monotributo: cuota fija mensual. Régimen general: declaraciones mensuales.',
    notas: 'Argentina tiene control de cambios (cepo cambiario). Los ingresos en divisas deben liquidarse al tipo de cambio oficial según BCRA. Situación cambia frecuentemente — consulta actualización.',
    recurso: 'afip.gob.ar',
  },
  {
    pais: 'Chile', bandera: '🇨🇱', region: 'Américas',
    impuestoRenta: 'Impuesto Global Complementario 0–40% según tramos.',
    iva: 'IVA 19%',
    umbralIva: 'Servicios digitales de plataformas extranjeras: IVA 19% retenido por la plataforma',
    registroAutonomo: 'Inicio de actividades en el SII (Servicio de Impuestos Internos). RUT necesario.',
    periodicidad: 'IVA mensual (formulario 29). Renta anual (abril).',
    notas: 'Chile tiene el IVA a servicios digitales muy bien regulado. Las plataformas extranjeras deben registrarse o el receptor paga. Boleta de honorarios electrónica obligatoria.',
    recurso: 'sii.cl',
  },
  {
    pais: 'Colombia', bandera: '🇨🇴', region: 'Américas',
    impuestoRenta: 'Impuesto de renta 0–39% según tramos.',
    iva: 'IVA 19%',
    umbralIva: 'Régimen simplificado: exento hasta ~$135.000.000 COP/año (~€30.000)',
    registroAutonomo: 'RUT en DIAN. Cámara de Comercio si constituyes empresa.',
    periodicidad: 'IVA bimestral. Renta anual.',
    notas: 'Persona natural puede operar sin empresa formal. Retención en la fuente del 11% aplicable en pagos de empresas colombianas. Los ingresos del exterior se declaran como renta extranjera.',
    recurso: 'dian.gov.co',
  },
  {
    pais: 'Brasil', bandera: '🇧🇷', region: 'Américas',
    impuestoRenta: 'IRPF 7,5–27,5% según tramos. Exento hasta R$ 2.824/mes.',
    iva: 'Sin IVA único. ISS (municipal) 2–5% en servicios. PIS/COFINS variable.',
    umbralIva: 'MEI (Microempreendedor Individual): simplificado hasta R$ 81.000/año',
    registroAutonomo: 'MEI online en gov.br. CPF para persona física.',
    periodicidad: 'MEI: cuota fija mensual ~R$ 70. Declaración DASN-SIMEI anual.',
    notas: 'El sistema tributario brasileño es muy complejo. MEI es ideal para empezar. Encima de R$ 81.000, se pasa a ME con Simples Nacional. Los servicios espirituales pueden estar sujetos a ISS municipal.',
    recurso: 'gov.br/empresas-e-negocios/pt-br/empreendedor',
  },
  {
    pais: 'Perú', bandera: '🇵🇪', region: 'Américas',
    impuestoRenta: 'IR 4a categoría (independientes): 8–30% según tramos. Retención 8% en fuente.',
    iva: 'IGV 18%',
    umbralIva: 'RUS (Régimen Único Simplificado): hasta S/ 96.000/año (~€24.000)',
    registroAutonomo: 'RUC en SUNAT. Recibos por honorarios electrónicos obligatorios.',
    periodicidad: 'Pagos a cuenta mensuales. Declaración anual marzo/abril.',
    notas: 'Los trabajadores independientes emiten recibos por honorarios. Si el pagador es empresa peruana, retienen 8% de IR. Para extranjeros no domiciliados, retención del 30%.',
    recurso: 'sunat.gob.pe',
  },
  {
    pais: 'Venezuela', bandera: '🇻🇪', region: 'Américas',
    impuestoRenta: 'ISLR 6–34% según tramos (en petros/bolívares).',
    iva: 'IVA 16%',
    umbralIva: 'Exento hasta 3.000 UT/año. UT sujeto a cambios frecuentes.',
    registroAutonomo: 'RIF en SENIAT.',
    periodicidad: 'IVA mensual. ISLR anual.',
    notas: 'Situación económica e hiperinflación hacen muy difícil la planificación. Los pagos en divisas (USD/EUR) son comunes. Consulta la normativa cambiaria del BCV actualizada.',
    recurso: 'seniat.gob.ve',
  },
  {
    pais: 'Uruguay', bandera: '🇺🇾', region: 'Américas',
    impuestoRenta: 'IRPF 0–36% según tramos.',
    iva: 'IVA 22% (10% tasa mínima para algunos servicios)',
    umbralIva: 'Monotributo: hasta ~UI 305.000/año (~€32.000)',
    registroAutonomo: 'BPS (Banco de Previsión Social) + DGI. Monotributo es la opción más simple.',
    periodicidad: 'IVA mensual. IRPF mensual (anticipos). Declaración anual.',
    notas: 'Uruguay tiene un sistema fiscal ordenado y estable. El Monotributo unifica BPS e impuestos en un pago mensual simple. Posible obtener residencia fiscal con presencia mínima.',
    recurso: 'dgi.gub.uy',
  },
  {
    pais: 'Ecuador', bandera: '🇪🇨', region: 'Américas',
    impuestoRenta: 'IR 0–37% según tramos.',
    iva: 'IVA 15% (aumentó en 2024)',
    umbralIva: 'RISE (Régimen Impositivo Simplificado): hasta $60.000/año',
    registroAutonomo: 'RUC en SRI.',
    periodicidad: 'IVA mensual o semestral. IR anual.',
    notas: 'Ecuador usa el dólar, lo que facilita los pagos internacionales. El RISE es una buena opción para autónomos con cuota fija mensual según categoría.',
    recurso: 'sri.gob.ec',
  },
  {
    pais: 'Bolivia', bandera: '🇧🇴', region: 'Américas',
    impuestoRenta: 'IUE (Impuesto Utilidades Empresas) 25% sobre utilidades netas.',
    iva: 'IVA 13%',
    umbralIva: 'Sistema Tributario Integrado (STI) para pequeños.',
    registroAutonomo: 'NIT en Servicio de Impuestos Nacionales.',
    periodicidad: 'IVA mensual. IUE anual.',
    notas: 'Bolivia tiene uno de los IVA más bajos de Sudamérica (13%). El RC-IVA aplica para personas naturales que no emiten factura. Siempre emite factura.',
    recurso: 'impuestos.gob.bo',
  },
  {
    pais: 'Paraguay', bandera: '🇵🇾', region: 'Américas',
    impuestoRenta: 'IRE (Impuesto Renta Empresarial) 10% flat.',
    iva: 'IVA 10%',
    umbralIva: 'Régimen Simplificado hasta ₲ 500.000.000/año',
    registroAutonomo: 'RUC en SET (Subsecretaría de Estado de Tributación).',
    periodicidad: 'IVA mensual. IRE anual.',
    notas: 'Paraguay tiene uno de los sistemas fiscales más simples y bajos de América Latina. Tasa flat del 10% muy atractiva. Creciente interés de nómadas digitales.',
    recurso: 'set.gov.py',
  },
  {
    pais: 'Guatemala', bandera: '🇬🇹', region: 'Américas',
    impuestoRenta: 'ISR 5% sobre ingresos brutos o 7% sobre utilidades.',
    iva: 'IVA 12%',
    umbralIva: 'Pequeño contribuyente hasta Q 150.000/trimestre',
    registroAutonomo: 'NIT en SAT Guatemala.',
    periodicidad: 'IVA mensual. ISR trimestral.',
    notas: 'Régimen Pequeño Contribuyente: IVA 5% simple hasta Q 150.000/trimestre. Muy favorable.',
    recurso: 'sat.gob.gt',
  },
  {
    pais: 'Costa Rica', bandera: '🇨🇷', region: 'Américas',
    impuestoRenta: 'Impuesto Renta: 10–25% según tramos.',
    iva: 'IVA 13%',
    umbralIva: 'Obligatorio con cualquier actividad lucrativa',
    registroAutonomo: 'Tributación Directa en Ministerio de Hacienda.',
    periodicidad: 'IVA mensual. Renta anual (diciembre).',
    notas: 'Costa Rica tiene buenos servicios y estabilidad. Zona Franca para empresas. Los servicios digitales están sujetos a IVA 13% desde 2020.',
    recurso: 'hacienda.go.cr',
  },
  // ── ASIA-PACÍFICO ────────────────────────────────────────
  {
    pais: 'Australia', bandera: '🇦🇺', region: 'Asia-Pacífico',
    impuestoRenta: 'Income Tax 19–45%. Tax-free threshold $18.200 AUD/año.',
    iva: 'GST 10%',
    umbralIva: 'Obligatorio registrarse si superas AUD $75.000/año',
    registroAutonomo: 'ABN (Australian Business Number) en abr.gov.au. Simple y gratuito.',
    periodicidad: 'BAS (Business Activity Statement) trimestral. Tax return anual (octubre).',
    notas: 'El ABN es muy fácil de obtener online. Sole trader es la forma más simple. Superannuation (jubilación) opcional para self-employed. MyGov para gestión online.',
    recurso: 'ato.gov.au/individuals/working/in-australia/self-employed',
  },
  {
    pais: 'Nueva Zelanda', bandera: '🇳🇿', region: 'Asia-Pacífico',
    impuestoRenta: 'Income Tax 10,5–39% según tramos.',
    iva: 'GST 15%',
    umbralIva: 'Obligatorio si superas NZD $60.000/año',
    registroAutonomo: 'IRD number en Inland Revenue. No hay registro formal de autónomo.',
    periodicidad: 'GST bimestral. Income tax anual o provisional payments.',
    notas: 'Nueva Zelanda tiene un sistema muy simple. El IRD number es suficiente para operar. Buen destino para nómadas digitales con Working Holiday Visa.',
    recurso: 'ird.govt.nz',
  },
  {
    pais: 'Japón', bandera: '🇯🇵', region: 'Asia-Pacífico',
    impuestoRenta: 'Shotoku-zei 5–45% federal + resident tax ~10%.',
    iva: 'Shohi-zei (消費税) 10%',
    umbralIva: 'Exento hasta ¥10.000.000/año (~€60.000)',
    registroAutonomo: 'Registro en tax office local como kojin jigyonushi (個人事業主). Blue Form recomendado.',
    periodicidad: 'IVA anual (si superas umbral). IR: declaración marzo.',
    notas: 'El Blue Form (青色申告) permite deducción especial de ¥650.000. El umbral de ¥10M para IVA es alto. Sistema Qualified Invoice (Inboisu) obligatorio desde oct 2023.',
    recurso: 'nta.go.jp',
  },
  {
    pais: 'Corea del Sur', bandera: '🇰🇷', region: 'Asia-Pacífico',
    impuestoRenta: 'Soget (소득세) 6–45% + resident tax 10% adicional.',
    iva: 'Buga-gachise (부가가치세) 10%',
    umbralIva: 'Exento hasta ₩48.000.000/año (~€33.000) como negocio simplificado',
    registroAutonomo: 'Registro en la Oficina de Impuestos del Distrito (세무서). Número de negocio necesario.',
    periodicidad: 'IVA semestral. IR anual (mayo).',
    notas: 'Corea tiene un sistema digital muy avanzado. HomeTax online para todas las gestiones. Los freelancers no residentes pagan withholding tax del 22%.',
    recurso: 'hometax.go.kr',
  },
  {
    pais: 'India', bandera: '🇮🇳', region: 'Asia-Pacífico',
    impuestoRenta: 'Income Tax 0–30% según tramos. Exento hasta ₹3 lakhs/año.',
    iva: 'GST 18% en la mayoría de servicios profesionales',
    umbralIva: 'Obligatorio si superas ₹20 lakhs/año (~€2.200) en la mayoría de estados',
    registroAutonomo: 'PAN card obligatorio. GST registration si superas umbral.',
    periodicidad: 'GST mensual (GSTR-1, GSTR-3B). IT return anual (31 julio).',
    notas: 'Los servicios exportados (a clientes fuera de India) son zero-rated en GST. Muy beneficioso. Presumptive taxation (Sec 44ADA) para profesionales: tributa sobre 50% ingresos.',
    recurso: 'incometax.gov.in',
  },
  {
    pais: 'Filipinas', bandera: '🇵🇭', region: 'Asia-Pacífico',
    impuestoRenta: 'Income Tax 0–35% según tramos.',
    iva: 'VAT 12%',
    umbralIva: 'Exento hasta ₱3.000.000/año (~€47.000)',
    registroAutonomo: 'TIN (Tax Identification Number) en BIR. Registro como self-employed.',
    periodicidad: 'VAT mensual. IT trimestral y anual.',
    notas: 'Los freelancers que prestan servicios a clientes extranjeros pueden aplicar zero-rated VAT. 8% flat tax opcional para ingresos bajo ₱3M.',
    recurso: 'bir.gov.ph',
  },
  {
    pais: 'Indonesia', bandera: '🇮🇩', region: 'Asia-Pacífico',
    impuestoRenta: 'PPh 5–35% según tramos.',
    iva: 'PPN 11%',
    umbralIva: 'Obligatorio si superas IDR 4.800.000.000/año (PKP)',
    registroAutonomo: 'NPWP (Nomor Pokok Wajib Pajak) en DJP.',
    periodicidad: 'PPN mensual si PKP. PPh final 0,5% mensual para UMKM (simplificado).',
    notas: 'El régimen UMKM (0,5% sobre ingresos brutos) es muy simple para pequeños freelancers. Los no residentes pagan withholding tax del 20%.',
    recurso: 'pajak.go.id',
  },
  {
    pais: 'Tailandia', bandera: '🇹🇭', region: 'Asia-Pacífico',
    impuestoRenta: 'Personal Income Tax 5–35% según tramos. Exento hasta 150.000 THB.',
    iva: 'VAT 7%',
    umbralIva: 'Obligatorio si superas 1.800.000 THB/año (~€45.000)',
    registroAutonomo: 'TIN en Revenue Department. Registro sencillo para persona física.',
    periodicidad: 'VAT mensual. PIT semestral y anual.',
    notas: 'Tailandia tiene el IVA más bajo de ASEAN (7%). El impuesto sobre remesas extranjeras cambió en 2024: ahora todos los ingresos remitidos al país tributan. Consulta actualización.',
    recurso: 'rd.go.th',
  },
  {
    pais: 'Singapur', bandera: '🇸🇬', region: 'Asia-Pacífico',
    impuestoRenta: 'Income Tax 0–24% según tramos. Exento hasta SGD $22.000/año.',
    iva: 'GST 9%',
    umbralIva: 'Obligatorio si superas SGD $1.000.000/año (~€690.000)',
    registroAutonomo: 'UEN (Unique Entity Number) en ACRA. Sole proprietorship o freelance sin registro.',
    periodicidad: 'GST trimestral si registrado. IT anual (15 abril).',
    notas: 'Singapur tiene uno de los sistemas fiscales más favorables del mundo. Sin impuesto sobre dividendos ni ganancias de capital. El umbral de GST es muy alto.',
    recurso: 'iras.gov.sg',
  },
  {
    pais: 'Malasia', bandera: '🇲🇾', region: 'Asia-Pacífico',
    impuestoRenta: 'Income Tax 0–30% según tramos.',
    iva: 'Sin IVA. SST (Sales & Service Tax) 6–10% en servicios',
    umbralIva: 'Obligatorio si superas RM 500.000/año en servicios taxables',
    registroAutonomo: 'MyKad o pasaporte para freelancers. Income tax filing con número de identidad.',
    periodicidad: 'SST bimestral si registrado. IT anual (30 abril).',
    notas: 'Malasia reemplazó el GST por SST en 2018. Los servicios digitales de plataformas extranjeras están sujetos a SST desde 2020. No existe "autónomo" formal — simplemente declaras.',
    recurso: 'hasil.gov.my',
  },
  // ── ORIENTE MEDIO Y ÁFRICA ───────────────────────────────
  {
    pais: 'Emiratos Árabes Unidos', bandera: '🇦🇪', region: 'Oriente Medio y África',
    impuestoRenta: 'Sin impuesto sobre la renta personal.',
    iva: 'VAT 5%',
    umbralIva: 'Obligatorio si superas AED 375.000/año (~€93.000). Voluntario desde AED 187.500.',
    registroAutonomo: 'Freelance permit (visa de freelance) o Free Zone license. Coste variable.',
    periodicidad: 'VAT trimestral. Sin declaración de renta.',
    notas: 'Los EAU son uno de los destinos más atractivos fiscalmente. Sin impuesto personal. El freelance permit cuesta ~AED 7.500-15.000/año según emirato (Dubai, Abu Dhabi, Sharjah).',
    recurso: 'tax.gov.ae',
  },
  {
    pais: 'Arabia Saudí', bandera: '🇸🇦', region: 'Oriente Medio y África',
    impuestoRenta: 'Sin impuesto sobre la renta para nacionales. Extranjeros: 20% sobre beneficios.',
    iva: 'VAT 15%',
    umbralIva: 'Obligatorio si superas SAR 375.000/año (~€90.000)',
    registroAutonomo: 'CR (Commercial Registration) en Wazarat Al-Tijara.',
    periodicidad: 'VAT trimestral. Zakat anual para empresas saudíes.',
    notas: 'Arabia Saudí permite trabajar a expatriados con iqama (permiso residencia). El Vision 2030 está atrayendo freelancers. IVA subió del 5% al 15% en 2020.',
    recurso: 'zatca.gov.sa',
  },
  {
    pais: 'Israel', bandera: '🇮🇱', region: 'Oriente Medio y África',
    impuestoRenta: 'Income Tax 10–50% según tramos.',
    iva: 'Mas Erech Musaf (מע"מ) 17%',
    umbralIva: 'Esek patur (exempt): exento si ingresos < ~NIS 120.000/año (~€29.000)',
    registroAutonomo: 'Registro como Osek Murshe (עוסק מורשה) o Osek Patur en Misrad HaOtsot.',
    periodicidad: 'IVA mensual/bimestral. IR anual.',
    notas: 'Osek Patur es el régimen más simple pero no puede cobrar ni reclamar IVA. Osek Murshe es necesario si superas el umbral. National Insurance (Bituach Leumi) obligatorio.',
    recurso: 'taxes.gov.il',
  },
  {
    pais: 'Sudáfrica', bandera: '🇿🇦', region: 'Oriente Medio y África',
    impuestoRenta: 'Income Tax 18–45% según tramos. Exento hasta ZAR 95.750/año.',
    iva: 'VAT 15%',
    umbralIva: 'Obligatorio si superas ZAR 1.000.000/año (~€48.000)',
    registroAutonomo: 'SARS registration. Sin registro formal de autónomo necesario.',
    periodicidad: 'VAT bimestral si registrado. IT: provisional (agosto y febrero) + anual.',
    notas: 'Los freelancers SA pueden reclamar gastos de home office y equipos. Provisional Tax obligatorio si ingresos no salariales superan ZAR 30.000/año.',
    recurso: 'sars.gov.za',
  },
  {
    pais: 'Nigeria', bandera: '🇳🇬', region: 'Oriente Medio y África',
    impuestoRenta: 'Personal Income Tax 7–24% según tramos.',
    iva: 'VAT 7,5%',
    umbralIva: 'Obligatorio si superas NGN 25.000.000/año (~€14.000)',
    registroAutonomo: 'TIN en FIRS. SMEDAN registration para pequeños negocios.',
    periodicidad: 'VAT mensual. PIT anual.',
    notas: 'Nigeria tiene complejidades bancarias para recibir pagos internacionales. Flutterwave, Paystack o cuentas en USD son alternativas. Los estados tienen sus propios impuestos adicionales.',
    recurso: 'firs.gov.ng',
  },
  {
    pais: 'Kenia', bandera: '🇰🇪', region: 'Oriente Medio y África',
    impuestoRenta: 'Income Tax 10–35% según tramos.',
    iva: 'VAT 16%',
    umbralIva: 'Obligatorio si superas KES 5.000.000/año (~€34.000)',
    registroAutonomo: 'KRA PIN en iTax portal. MCA registration para negocios.',
    periodicidad: 'VAT mensual. IT anual (30 junio).',
    notas: 'Kenya tiene M-Pesa muy extendido para pagos. Los digital services están gravados con 1,5% Digital Service Tax (DST) adicional para plataformas extranjeras.',
    recurso: 'kra.go.ke',
  },
  // ── EUROPA DEL ESTE ──────────────────────────────────────
  {
    pais: 'Rumanía', bandera: '🇷🇴', region: 'Europa',
    impuestoRenta: 'Impozit pe venit 10% flat.',
    iva: 'TVA 19%',
    umbralIva: 'Exento hasta RON 300.000/año (~€60.000)',
    registroAutonomo: 'PFA (Persoana Fizică Autorizată) en Registrul Comerțului.',
    periodicidad: 'TVA trimestral. IT anual.',
    notas: 'Rumanía tiene uno de los tipos flat más bajos de la UE (10%). PFA es muy popular y simple. Contribuciones CAS y CASS obligatorias si superas 12 salarios mínimos.',
    recurso: 'anaf.ro',
  },
  {
    pais: 'Bulgaria', bandera: '🇧🇬', region: 'Europa',
    impuestoRenta: 'Подоходен данък (DDFL) 10% flat.',
    iva: 'ДДС 20%',
    umbralIva: 'Obligatorio si superas BGN 100.000/año (~€51.000)',
    registroAutonomo: 'ЕТ (Едноличен търговец) en Registar BULSTAT.',
    periodicidad: 'ДДС mensual/trimestral. DDFL anual.',
    notas: 'Bulgaria tiene el impuesto flat más bajo de la UE (10%) junto con Rumanía. Muy atractivo para freelancers. Cotizaciones sociales obligatorias sobre base mínima.',
    recurso: 'nra.bg',
  },
  {
    pais: 'Hungría', bandera: '🇭🇺', region: 'Europa',
    impuestoRenta: 'SZJA 15% flat.',
    iva: 'ÁFA 27% (el más alto de la UE)',
    umbralIva: 'Kata (régimen simplificado): exento hasta HUF 18.000.000/año',
    registroAutonomo: 'Egyéni vállalkozó en NAV. Kata o vállalkozói jövedelem.',
    periodicidad: 'ÁFA mensual/trimestral. SZJA anual.',
    notas: 'Hungría tiene el IVA más alto de la UE (27%) pero un IRPF flat del 15% muy bajo. El régimen Kata se simplificó en 2022: ahora solo para B2B doméstico principalmente.',
    recurso: 'nav.gov.hu',
  },
  {
    pais: 'Estonia', bandera: '🇪🇪', region: 'Europa',
    impuestoRenta: 'Tulumaks 20% flat. Sin impuesto sobre beneficios retenidos en empresa.',
    iva: 'Käibemaks 22%',
    umbralIva: 'Obligatorio si superas €40.000/año',
    registroAutonomo: 'FIE (Füüsilisest Isikust Ettevõtja) en e-ettevõtjaportaal. 100% digital.',
    periodicidad: 'Käibemaks mensual. Tulumaks anual.',
    notas: 'Estonia tiene la empresa digital más famosa del mundo: e-Residency. Puedes abrir una empresa estonia sin vivir allí. El sistema e-Residency es ideal para nómadas digitales.',
    recurso: 'e-resident.gov.ee',
  },
  {
    pais: 'Letonia', bandera: '🇱🇻', region: 'Europa',
    impuestoRenta: 'IIN 20–31% según tramos.',
    iva: 'PVN 21%',
    umbralIva: 'Obligatorio si superas €50.000/año',
    registroAutonomo: 'SIA (sociedad) o IK (Individuālais komersants) en UR.gov.lv.',
    periodicidad: 'PVN mensual. IIN anual.',
    notas: 'El régimen de microempresa (MUN) permite tipo reducido del 25% sobre ingresos brutos hasta €25.000. Simple para freelancers.',
    recurso: 'vid.gov.lv',
  },
  {
    pais: 'Lituania', bandera: '🇱🇹', region: 'Europa',
    impuestoRenta: 'GPM 15–20% según nivel de ingresos.',
    iva: 'PVM 21%',
    umbralIva: 'Obligatorio si superas €45.000/año',
    registroAutonomo: 'MB (Mažoji bendrija) o IĮ (Individuali įmonė) en Registrų centras.',
    periodicidad: 'PVM mensual. GPM anual.',
    notas: 'Lituania permite actividad por cuenta propia (verslo liudijimas) con cuota fija anual muy barata. Ideal para ingresos bajos.',
    recurso: 'vmi.lt',
  },
  {
    pais: 'Eslovaquia', bandera: '🇸🇰', region: 'Europa',
    impuestoRenta: 'Daň z príjmov 15–25%.',
    iva: 'DPH 20%',
    umbralIva: 'Obligatorio si superas €50.000/año',
    registroAutonomo: 'SZČO (Samostatne zárobkovo činná osoba) en Živnostenský register.',
    periodicidad: 'DPH mensual/trimestral. DPFO anual.',
    notas: 'Eslovaquia tiene un sistema de deducciones favorables (paušálne výdavky: 60% de ingresos como gastos sin justificación). Cotizaciones sociales variables.',
    recurso: 'financnasprava.sk',
  },
  {
    pais: 'Eslovenia', bandera: '🇸🇮', region: 'Europa',
    impuestoRenta: 'Dohodnina 16–50% según tramos.',
    iva: 'DDV 22%',
    umbralIva: 'Obligatorio si superas €50.000/año',
    registroAutonomo: 'S.P. (Samostojni podjetnik) en AJPES.',
    periodicidad: 'DDV mensual/trimestral. Dohodnina anual.',
    notas: 'El SP puede usar normirani odhodki (gastos normalizados 80%) sin justificación. Eslovenia tiene uno de los sistemas de normirani más generosos de la UE.',
    recurso: 'fu.gov.si',
  },
  {
    pais: 'Croacia', bandera: '🇭🇷', region: 'Europa',
    impuestoRenta: 'Porez na dohodak 20–30%.',
    iva: 'PDV 25%',
    umbralIva: 'Exento hasta €40.000/año',
    registroAutonomo: 'Obrtnik o slobodna zanimanja en Obrtni registar.',
    periodicidad: 'PDV mensual/trimestral. Dohodak anual.',
    notas: 'Croacia (euro desde 2023) permite paušalno oporezivanje (impuesto forfetario) para ingresos bajos. Muy simple.',
    recurso: 'porezna-uprava.gov.hr',
  },
]

const REGIONES = ['Todas', 'Europa', 'Américas', 'Asia-Pacífico', 'Oriente Medio y África']

export default function FiscalExperto({ anioFiscal, sesiones }: { anioFiscal: number; sesiones: any[] }) {
  const [regionFiltro, setRegionFiltro] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [paisExpandido, setPaisExpandido] = useState<string | null>(null)

  const paisesFiltrados = PAISES_FISCALES.filter(p => {
    const matchRegion = regionFiltro === 'Todas' || p.region === regionFiltro
    const matchBusqueda = !busqueda || p.pais.toLowerCase().includes(busqueda.toLowerCase())
    return matchRegion && matchBusqueda
  })

  return (
    <div className="flex flex-col gap-4">

      {/* Aviso legal importante */}
      <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4">
        <p className="text-amber-300 text-xs font-semibold mb-1">⚠️ Información orientativa</p>
        <p className="text-white/70 text-xs leading-relaxed">
          Esta información es de carácter general y educativo. Las leyes fiscales cambian frecuentemente y varían según tu situación personal. <strong className="text-white">Consulta siempre con un asesor fiscal o gestor en tu país</strong> antes de tomar decisiones. UNIVERSE no se responsabiliza de errores u omisiones en esta información.
        </p>
      </div>

      {/* Principio fundamental */}
      <div className="bg-black/70 border border-white/15 rounded-2xl p-4">
        <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">📌 Principio fundamental</p>
        <p className="text-white text-sm leading-relaxed">
          Como experto independiente en UNIVERSE, eres responsable de declarar tus ingresos en tu país de residencia fiscal. Tu residencia fiscal es generalmente donde vives más de 183 días al año, independientemente de tu nacionalidad.
        </p>
        <div className="mt-3 flex flex-col gap-1.5">
          {[
            'Guarda todos los pagos recibidos de UNIVERSE como justificante',
            'Exporta el informe fiscal mensual/anual desde este panel',
            'Declara siempre los ingresos aunque no recibas notificación',
            'Si cobras en EUR desde España, aplica la normativa española',
          ].map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-green-400 text-xs mt-0.5">✓</span>
              <p className="text-white/80 text-xs">{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buscador */}
      <div className="bg-black/60 border border-white/15 rounded-xl px-4 py-3 flex items-center gap-2">
        <span className="text-white/40">🔍</span>
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar país..."
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/30"
        />
      </div>

      {/* Filtro regiones */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {REGIONES.map(r => (
          <button key={r} onClick={() => setRegionFiltro(r)}
            className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition flex-shrink-0 ${regionFiltro === r ? 'bg-purple-600 border-purple-400 text-white' : 'bg-black/50 border-white/20 text-white/70'}`}>
            {r}
          </button>
        ))}
      </div>

      <p className="text-white/40 text-xs">{paisesFiltrados.length} países</p>

      {/* Lista de países */}
      {paisesFiltrados.map(p => (
        <div key={p.pais} className="bg-black/70 border border-white/15 rounded-2xl overflow-hidden">
          <button
            onClick={() => setPaisExpandido(paisExpandido === p.pais ? null : p.pais)}
            className="w-full p-4 text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{p.bandera}</span>
              <div>
                <p className="text-white font-semibold text-sm">{p.pais}</p>
                <p className="text-white/50 text-xs">{p.region}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white/70 text-xs">IVA {p.iva.split(' ')[0]}</p>
              </div>
              <span className="text-white/40">{paisExpandido === p.pais ? '▲' : '▼'}</span>
            </div>
          </button>

          {paisExpandido === p.pais && (
            <div className="px-4 pb-4 flex flex-col gap-3 border-t border-white/10 pt-3">
              {[
                { label: '💰 Impuesto sobre la renta', val: p.impuestoRenta },
                { label: '🧾 IVA/GST/VAT', val: p.iva },
                { label: '📊 Umbral de registro IVA', val: p.umbralIva },
                { label: '🏢 Cómo registrarse', val: p.registroAutonomo },
                { label: '📅 Periodicidad', val: p.periodicidad },
                { label: '💡 Notas importantes', val: p.notas },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-purple-300 text-xs font-semibold mb-0.5">{item.label}</p>
                  <p className="text-white/80 text-xs leading-relaxed">{item.val}</p>
                </div>
              ))}
              <a href={`https://${p.recurso}`} target="_blank" rel="noopener noreferrer"
                className="text-purple-400 text-xs underline mt-1">
                🔗 {p.recurso} →
              </a>
            </div>
          )}
        </div>
      ))}

      {/* Footer */}
      <div className="bg-black/50 border border-white/10 rounded-2xl p-4">
        <p className="text-white/30 text-xs leading-relaxed text-center">
          Información actualizada septiembre 2026. Las leyes fiscales cambian frecuentemente. Siempre consulta con un profesional. UNIVERSE no presta servicios de asesoría fiscal.
        </p>
      </div>
    </div>
  )
}
