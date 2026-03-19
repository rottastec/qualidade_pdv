export const ROLES = {
  ADMIN: 'admin',
  COMERCIAL: 'comercial',
  ARQUITETURA: 'arquitetura',
  LEGACY_USER: 'user',
};

export const normalizeRole = (role) => {
  const normalized = String(role || '').toLowerCase();
  if (normalized === ROLES.LEGACY_USER) return ROLES.COMERCIAL;
  if (normalized === ROLES.ADMIN) return ROLES.ADMIN;
  if (normalized === ROLES.ARQUITETURA) return ROLES.ARQUITETURA;
  if (normalized === ROLES.COMERCIAL) return ROLES.COMERCIAL;
  return ROLES.COMERCIAL;
};

export const normalizeAllowedStates = (estados) => {
  if (Array.isArray(estados)) {
    return estados
      .map((estado) => String(estado || '').trim().toUpperCase())
      .filter(Boolean);
  }

  if (typeof estados === 'string') {
    return estados
      .split(',')
      .map((estado) => estado.trim().toUpperCase())
      .filter(Boolean);
  }

  return [];
};

export const canAccessAllStates = (role) => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === ROLES.ADMIN || normalizedRole === ROLES.ARQUITETURA;
};

export const canFlagCommercialVisibility = (role) => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === ROLES.ADMIN || normalizedRole === ROLES.ARQUITETURA;
};

export const canManageUsers = (role) => normalizeRole(role) === ROLES.ADMIN;

export const resolvePdvEstado = (relatorio, pdvById, pdvByName) => {
  if (!relatorio) return '';

  const pdvId = relatorio.pdv_id;
  const pdvNome = relatorio.pdv_nome;

  let pdv = null;

  if (pdvId != null && pdvId !== '' && pdvId !== 'null' && pdvId !== 'undefined') {
    pdv = pdvById.get(String(pdvId));
  }

  if (!pdv && pdvNome) {
    pdv = pdvByName.get(String(pdvNome).trim().toLowerCase());
  }

  return String(pdv?.estado || '').toUpperCase();
};

export const canViewRelatorio = ({ role, allowedStates, relatorio, pdvById, pdvByName }) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === ROLES.ADMIN || normalizedRole === ROLES.ARQUITETURA) {
    return true;
  }

  if (relatorio?.visivel_comercial === false) {
    return false;
  }

  const estado = resolvePdvEstado(relatorio, pdvById, pdvByName);

  if (!estado) {
    return false;
  }

  return allowedStates.includes(estado);
};

export const filterPdvsByAccess = ({ role, allowedStates, pdvs }) => {
  if (canAccessAllStates(role)) return pdvs;
  return pdvs.filter((pdv) => allowedStates.includes(String(pdv.estado || '').toUpperCase()));
};
