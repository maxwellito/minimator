const ICON_CATALOG: {[id: string]: string} = {
  grid: `
    <line x1="6" y1="6" x2="6" y2="6"></line>
    <line x1="6" y1="10" x2="6" y2="10"></line>
    <line x1="6" y1="14" x2="6" y2="14"></line>
    <line x1="6" y1="18" x2="6" y2="18"></line>
    <line x1="10" y1="6" x2="10" y2="6"></line>
    <line x1="10" y1="10" x2="10" y2="10"></line>
    <line x1="10" y1="14" x2="10" y2="14"></line>
    <line x1="10" y1="18" x2="10" y2="18"></line>
    <line x1="14" y1="6" x2="14" y2="6"></line>
    <line x1="14" y1="10" x2="14" y2="10"></line>
    <line x1="14" y1="14" x2="14" y2="14"></line>
    <line x1="14" y1="18" x2="14" y2="18"></line>
    <line x1="18" y1="6" x2="18" y2="6"></line>
    <line x1="18" y1="10" x2="18" y2="10"></line>
    <line x1="18" y1="14" x2="18" y2="14"></line>
    <line x1="18" y1="18" x2="18" y2="18"></line>`,
  minus: `
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="8" y1="12" x2="16" y2="12"></line>`,
  plus: `
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>`,
  share: `
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>`,
  download: `
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>`,
  eraser: `
    <path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4L20 11L11 20"/>
    <path d="M6 11L13 18"/>`,
  trash: `
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>`,
  edit: `
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>`,
  pen: `
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>`,
  scaleX: `
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="16 9 19 12 16 15"/>
    <polyline points="8 9 5 12 8 15"/>`,
  scaleY: `
    <line x1="12" y1="5" x2="12" y2="19"/>
    <polyline points=" 9 16 12 19 15 16"/>
    <polyline points=" 9 8 12 5 15 8"/>`,
  playCircle: `
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="10 8 16 12 10 16 10 8"></polygon>`,
  times: `
    <line x1="5" y1="5" x2="19" y2="19"/>
    <line x1="5" y1="19" x2="19" y2="5"/>`,
  home: `
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>`
};

export function icon(name: string, ref?: string, alt?:string) {
  const iconData = ICON_CATALOG[name];
  if (!iconData) {
    throw new Error (`The '${name}' icon, doesn't exists.`);
  }

  const dataRef = ref ? `data-ref="${ref}"` : '';
  const altWrap = alt ? `alt="${alt}"` : '';
  const titleWrap = alt ? `<title>${alt}</title>` : '';

  return `<svg ${dataRef} ${altWrap} class="feather" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    ${titleWrap}
    ${iconData}
  </svg>`;
}