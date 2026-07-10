/**
 * MGM lion mark. Renders the brand asset in /public/mgm-logo.svg — the full
 * "MGM 美高梅" lion wordmark. Swap that single asset to re-brand; sizing here
 * stays the same. The colour is set in the SVG (brand gold) so it reads on both
 * the dark header and the ivory sidebar.
 */
export function MgmLogo({ size = 40 }: { size?: number }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}mgm-logo.svg`}
      alt="MGM"
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}
