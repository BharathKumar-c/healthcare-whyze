export function getDeployEnv() {
  return process.env.DEPLOY_ENV;
}

export function envSpecific(
  logicalName: string | Function,
  type: string = "any"
) {
  const suffix =
    typeof logicalName === "function" ? logicalName.name : logicalName;
  if (type === "DB") {
    return `${getDeployEnv()}_${suffix}`;
  }
  return `${getDeployEnv()}-${suffix}`;
}
