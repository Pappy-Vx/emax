const Icon = ({ path, size = 28, stroke = 1.75, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {path}
  </svg>
);

const Icons = {
  Pharmacy: (p) => (
    <Icon {...p} path={<>
      <path d="M6 4h12l-1.5 5h-9z" />
      <path d="M5 9h14l-1.5 10a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7z" />
      <path d="M12 12v5" /><path d="M9.5 14.5h5" />
    </>}
  />),
  Return: (p) => (
    <Icon {...p} path={<>
      <path d="M3 7h11a5 5 0 0 1 0 10H8" />
      <path d="M7 3 3 7l4 4" />
      <path d="M16 14l3 3-3 3" />
    </>}
  />),
  Bag: (p) => (
    <Icon {...p} path={<>
      <path d="M5 8h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M9 12h6" />
    </>}
  />),
  Doc: (p) => (
    <Icon {...p} path={<>
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 17h4" />
    </>}
  />),
  Mail: (p) => (
    <Icon {...p} path={<>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 8l9 6 9-6" />
      <path d="M3 19l6-6M21 19l-6-6" />
    </>}
  />),
  Book: (p) => (
    <Icon {...p} path={<>
      <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19a2 2 0 0 0 2 2h12" />
      <path d="M8 7h7M8 11h5" />
    </>}
  />),
  Box: (p) => (
    <Icon {...p} path={<>
      <path d="M3 7l9-4 9 4-9 4z" />
      <path d="M3 7v10l9 4 9-4V7" />
      <path d="M12 11v10" />
    </>}
  />),
  Calendar: (p) => (
    <Icon {...p} path={<>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
      <path d="M8 14h2v2H8z" />
    </>}
  />),
  Sparkle: (p) => (
    <Icon {...p} path={<>
      <path d="M12 3l1.8 4.7L18 9.5l-4.2 1.8L12 16l-1.8-4.7L6 9.5l4.2-1.8z" />
      <path d="M19 14l.8 2 2 .8-2 .8L19 20l-.8-2-2-.8 2-.8z" />
    </>}
  />),
  Phone: (p) => (
    <Icon {...p} path={<>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </>}
  />),
  Msg: (p) => (
    <Icon {...p} path={<>
      <path d="M21 12a8 8 0 0 1-11.5 7.2L5 21l1.2-3.7A8 8 0 1 1 21 12z" />
    </>}
  />),
  Pin: (p) => (
    <Icon {...p} path={<>
      <path d="M12 21s-7-7.2-7-12a7 7 0 0 1 14 0c0 4.8-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>}
  />),
  Clock: (p) => (
    <Icon {...p} path={<>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>}
  />),
  Check: (p) => (
    <Icon {...p} path={<>
      <path d="M4 12l5 5L20 6" />
    </>}
  />),
  Star: (p) => (
    <Icon {...p} path={<>
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
    </>}
  />),
  Arrow: (p) => (
    <Icon {...p} path={<>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>}
  />),
  Menu: (p) => (
    <Icon {...p} path={<>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>}
  />),
  X: (p) => (
    <Icon {...p} path={<>
      <path d="M6 6l12 12M18 6L6 18" />
    </>}
  />),
  Family: (p) => (
    <Icon {...p} path={<>
      <circle cx="7" cy="7" r="3" /><circle cx="17" cy="7" r="3" />
      <path d="M2 20c.6-3 2.6-5 5-5s4.4 2 5 5" />
      <path d="M12 20c.6-3 2.6-5 5-5s4.4 2 5 5" />
    </>}
  />),
  Briefcase: (p) => (
    <Icon {...p} path={<>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </>}
  />),
  Heart: (p) => (
    <Icon {...p} path={<>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </>}
  />),
  Building: (p) => (
    <Icon {...p} path={<>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" />
    </>}
  />),
  Home: (p) => (
    <Icon {...p} path={<>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </>}
  />),
  Fb: (p) => (
    <Icon {...p} path={<>
      <path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v8h3v-8h2.2l.5-3H14V8.5c0-.3.2-.5.5-.5z" />
    </>}
  />),
  Ig: (p) => (
    <Icon {...p} path={<>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" />
    </>}
  />),
  Bee: (p) => (
    <Icon {...p} path={<>
      <ellipse cx="12" cy="13" rx="5" ry="6" />
      <path d="M7 11h10M7 14h10" />
      <path d="M9 7c-1-1.5-3-2-4-1s-.5 2.5 1 3.5" />
      <path d="M15 7c1-1.5 3-2 4-1s.5 2.5-1 3.5" />
    </>}
  />),
};

export default Icons;
