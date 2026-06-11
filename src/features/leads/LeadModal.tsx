import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Lead } from './LeadTable';
import './LeadModal.css';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => Promise<void>;
  initialData?: Lead | null;
}

const COUNTRY_CODES = [
  { code: '+93', label: 'AF (+93)' },
  { code: '+355', label: 'AL (+355)' },
  { code: '+213', label: 'DZ (+213)' },
  { code: '+376', label: 'AD (+376)' },
  { code: '+244', label: 'AO (+244)' },
  { code: '+1', label: 'AI (+1)' },
  { code: '+1', label: 'AG (+1)' },
  { code: '+54', label: 'AR (+54)' },
  { code: '+374', label: 'AM (+374)' },
  { code: '+297', label: 'AW (+297)' },
  { code: '+61', label: 'AU (+61)' },
  { code: '+43', label: 'AT (+43)' },
  { code: '+994', label: 'AZ (+994)' },
  { code: '+1', label: 'BS (+1)' },
  { code: '+973', label: 'BH (+973)' },
  { code: '+880', label: 'BD (+880)' },
  { code: '+1', label: 'BB (+1)' },
  { code: '+375', label: 'BY (+375)' },
  { code: '+32', label: 'BE (+32)' },
  { code: '+501', label: 'BZ (+501)' },
  { code: '+229', label: 'BJ (+229)' },
  { code: '+1', label: 'BM (+1)' },
  { code: '+975', label: 'BT (+975)' },
  { code: '+591', label: 'BO (+591)' },
  { code: '+387', label: 'BA (+387)' },
  { code: '+267', label: 'BW (+267)' },
  { code: '+55', label: 'BR (+55)' },
  { code: '+673', label: 'BN (+673)' },
  { code: '+359', label: 'BG (+359)' },
  { code: '+226', label: 'BF (+226)' },
  { code: '+257', label: 'BI (+257)' },
  { code: '+855', label: 'KH (+855)' },
  { code: '+237', label: 'CM (+237)' },
  { code: '+1', label: 'CA (+1)' },
  { code: '+238', label: 'CV (+238)' },
  { code: '+1', label: 'KY (+1)' },
  { code: '+236', label: 'CF (+236)' },
  { code: '+235', label: 'TD (+235)' },
  { code: '+56', label: 'CL (+56)' },
  { code: '+86', label: 'CN (+86)' },
  { code: '+57', label: 'CO (+57)' },
  { code: '+269', label: 'KM (+269)' },
  { code: '+242', label: 'CG (+242)' },
  { code: '+682', label: 'CK (+682)' },
  { code: '+506', label: 'CR (+506)' },
  { code: '+385', label: 'HR (+385)' },
  { code: '+53', label: 'CU (+53)' },
  { code: '+357', label: 'CY (+357)' },
  { code: '+420', label: 'CZ (+420)' },
  { code: '+45', label: 'DK (+45)' },
  { code: '+253', label: 'DJ (+253)' },
  { code: '+1', label: 'DM (+1)' },
  { code: '+1', label: 'DO (+1)' },
  { code: '+593', label: 'EC (+593)' },
  { code: '+20', label: 'EG (+20)' },
  { code: '+503', label: 'SV (+503)' },
  { code: '+240', label: 'GQ (+240)' },
  { code: '+291', label: 'ER (+291)' },
  { code: '+372', label: 'EE (+372)' },
  { code: '+268', label: 'SZ (+268)' },
  { code: '+251', label: 'ET (+251)' },
  { code: '+298', label: 'FO (+298)' },
  { code: '+679', label: 'FJ (+679)' },
  { code: '+358', label: 'FI (+358)' },
  { code: '+33', label: 'FR (+33)' },
  { code: '+241', label: 'GA (+241)' },
  { code: '+220', label: 'GM (+220)' },
  { code: '+995', label: 'GE (+995)' },
  { code: '+49', label: 'DE (+49)' },
  { code: '+233', label: 'GH (+233)' },
  { code: '+350', label: 'GI (+350)' },
  { code: '+30', label: 'GR (+30)' },
  { code: '+299', label: 'GL (+299)' },
  { code: '+1', label: 'GD (+1)' },
  { code: '+502', label: 'GT (+502)' },
  { code: '+224', label: 'GN (+224)' },
  { code: '+245', label: 'GW (+245)' },
  { code: '+592', label: 'GY (+592)' },
  { code: '+509', label: 'HT (+509)' },
  { code: '+504', label: 'HN (+504)' },
  { code: '+852', label: 'HK (+852)' },
  { code: '+36', label: 'HU (+36)' },
  { code: '+354', label: 'IS (+354)' },
  { code: '+91', label: 'IN (+91)' },
  { code: '+62', label: 'ID (+62)' },
  { code: '+98', label: 'IR (+98)' },
  { code: '+964', label: 'IQ (+964)' },
  { code: '+353', label: 'IE (+353)' },
  { code: '+972', label: 'IL (+972)' },
  { code: '+39', label: 'IT (+39)' },
  { code: '+1', label: 'JM (+1)' },
  { code: '+81', label: 'JP (+81)' },
  { code: '+962', label: 'JO (+962)' },
  { code: '+7', label: 'KZ (+7)' },
  { code: '+254', label: 'KE (+254)' },
  { code: '+965', label: 'KW (+965)' },
  { code: '+996', label: 'KG (+996)' },
  { code: '+856', label: 'LA (+856)' },
  { code: '+371', label: 'LV (+371)' },
  { code: '+961', label: 'LB (+961)' },
  { code: '+266', label: 'LS (+266)' },
  { code: '+231', label: 'LR (+231)' },
  { code: '+218', label: 'LY (+218)' },
  { code: '+423', label: 'LI (+423)' },
  { code: '+370', label: 'LT (+370)' },
  { code: '+352', label: 'LU (+352)' },
  { code: '+853', label: 'MO (+853)' },
  { code: '+261', label: 'MG (+261)' },
  { code: '+265', label: 'MW (+265)' },
  { code: '+60', label: 'MY (+60)' },
  { code: '+960', label: 'MV (+960)' },
  { code: '+223', label: 'ML (+223)' },
  { code: '+356', label: 'MT (+356)' },
  { code: '+222', label: 'MR (+222)' },
  { code: '+230', label: 'MU (+230)' },
  { code: '+52', label: 'MX (+52)' },
  { code: '+373', label: 'MD (+373)' },
  { code: '+377', label: 'MC (+377)' },
  { code: '+976', label: 'MN (+976)' },
  { code: '+382', label: 'ME (+382)' },
  { code: '+1', label: 'MS (+1)' },
  { code: '+212', label: 'MA (+212)' },
  { code: '+258', label: 'MZ (+258)' },
  { code: '+95', label: 'MM (+95)' },
  { code: '+264', label: 'NA (+264)' },
  { code: '+977', label: 'NP (+977)' },
  { code: '+31', label: 'NL (+31)' },
  { code: '+64', label: 'NZ (+64)' },
  { code: '+505', label: 'NI (+505)' },
  { code: '+227', label: 'NE (+227)' },
  { code: '+234', label: 'NG (+234)' },
  { code: '+47', label: 'NO (+47)' },
  { code: '+968', label: 'OM (+968)' },
  { code: '+92', label: 'PK (+92)' },
  { code: '+970', label: 'PS (+970)' },
  { code: '+507', label: 'PA (+507)' },
  { code: '+675', label: 'PG (+675)' },
  { code: '+595', label: 'PY (+595)' },
  { code: '+51', label: 'PE (+51)' },
  { code: '+63', label: 'PH (+63)' },
  { code: '+48', label: 'PL (+48)' },
  { code: '+351', label: 'PT (+351)' },
  { code: '+1', label: 'PR (+1)' },
  { code: '+974', label: 'QA (+974)' },
  { code: '+40', label: 'RO (+40)' },
  { code: '+7', label: 'RU (+7)' },
  { code: '+250', label: 'RW (+250)' },
  { code: '+1', label: 'KN (+1)' },
  { code: '+1', label: 'LC (+1)' },
  { code: '+1', label: 'VC (+1)' },
  { code: '+685', label: 'WS (+685)' },
  { code: '+378', label: 'SM (+378)' },
  { code: '+966', label: 'SA (+966)' },
  { code: '+221', label: 'SN (+221)' },
  { code: '+381', label: 'RS (+381)' },
  { code: '+248', label: 'SC (+248)' },
  { code: '+232', label: 'SL (+232)' },
  { code: '+65', label: 'SG (+65)' },
  { code: '+421', label: 'SK (+421)' },
  { code: '+386', label: 'SI (+386)' },
  { code: '+677', label: 'SB (+677)' },
  { code: '+252', label: 'SO (+252)' },
  { code: '+27', label: 'ZA (+27)' },
  { code: '+82', label: 'KR (+82)' },
  { code: '+34', label: 'ES (+34)' },
  { code: '+94', label: 'LK (+94)' },
  { code: '+249', label: 'SD (+249)' },
  { code: '+597', label: 'SR (+597)' },
  { code: '+46', label: 'SE (+46)' },
  { code: '+41', label: 'CH (+41)' },
  { code: '+963', label: 'SY (+963)' },
  { code: '+886', label: 'TW (+886)' },
  { code: '+255', label: 'TZ (+255)' },
  { code: '+66', label: 'TH (+66)' },
  { code: '+228', label: 'TG (+228)' },
  { code: '+676', label: 'TO (+676)' },
  { code: '+1', label: 'TT (+1)' },
  { code: '+216', label: 'TN (+216)' },
  { code: '+90', label: 'TR (+90)' },
  { code: '+993', label: 'TM (+993)' },
  { code: '+1', label: 'TC (+1)' },
  { code: '+256', label: 'UG (+256)' },
  { code: '+380', label: 'UA (+380)' },
  { code: '+971', label: 'AE (+971)' },
  { code: '+44', label: 'GB (+44)' },
  { code: '+1', label: 'US (+1)' },
  { code: '+598', label: 'UY (+598)' },
  { code: '+998', label: 'UZ (+998)' },
  { code: '+58', label: 'VE (+58)' },
  { code: '+84', label: 'VN (+84)' },
  { code: '+1', label: 'VG (+1)' },
  { code: '+1', label: 'VI (+1)' },
  { code: '+967', label: 'YE (+967)' },
  { code: '+260', label: 'ZM (+260)' },
  { code: '+263', label: 'ZW (+263)' },
];

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Lead>>({ name: '', company: '', email: '', phone: '', status: 'New' });
  const [countryCode, setCountryCode] = useState('+27');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      const phoneStr = initialData.phone || '';
      const matched = COUNTRY_CODES.find(c => phoneStr.startsWith(c.code));
      if (matched) {
        setCountryCode(matched.code);
        setPhoneNumber(phoneStr.substring(matched.code.length));
      } else {
        if (phoneStr.startsWith('+')) {
          const codePart = phoneStr.split(' ')[0] || '';
          if (codePart && codePart.length <= 4) {
            setCountryCode(codePart);
            setPhoneNumber(phoneStr.substring(codePart.length));
          } else {
            setCountryCode('+1');
            setPhoneNumber(phoneStr);
          }
        } else {
          setCountryCode('+1');
          setPhoneNumber(phoneStr);
        }
      }
    } else {
      setFormData({ name: '', company: '', email: '', phone: '+27', status: 'New' });
      setCountryCode('+27');
      setPhoneNumber('');
    }
  }, [initialData, isOpen]);

  const handlePhoneChange = (code: string, num: string) => {
    setCountryCode(code);
    setPhoneNumber(num);
    setFormData(prev => ({ ...prev, phone: code + num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        id: initialData?.id || Math.random().toString(36).substr(2, 9),
        dateAdded: initialData?.dateAdded || new Date().toLocaleDateString()
      } as Lead);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={isSaving ? undefined : onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData ? 'Edit Lead' : 'Create New Lead'}</h3>
          <button onClick={onClose} disabled={isSaving}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Row 1: Three fields (Lead Name, Company, Email) */}
            <div className="lead-form-row-3">
              <div className="form-group"><label>Lead Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} maxLength={150} required /></div>
              <div className="form-group"><label>Company</label><input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} maxLength={150} required /></div>
              <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
            </div>
            
            {/* Row 2: Two fields (Phone with country code selector, Status) */}
            <div className="lead-form-row-2">
              <div className="form-group">
                <label>Phone</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={countryCode} 
                    onChange={e => handlePhoneChange(e.target.value, phoneNumber)}
                    className="country-code-select"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <input 
                    type="tel" 
                    value={phoneNumber} 
                    onChange={e => handlePhoneChange(countryCode, e.target.value)} 
                    placeholder="Phone number"
                    style={{ flex: 1 }}
                    required 
                  />
                </div>
              </div>
              <div className="form-group"><label>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                  <option value="New">New</option><option value="Contacted">Contacted</option><option value="Qualified">Qualified</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-premium-secondary" disabled={isSaving}>Cancel</button>
            <button type="submit" className="btn-premium-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
