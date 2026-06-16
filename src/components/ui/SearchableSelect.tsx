import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: 'compact' | 'premium';
  searchable?: boolean;
  placement?: 'bottom' | 'top';
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  disabled = false,
  required = false,
  variant = 'compact',
  searchable = true,
  placement = 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const isPremium = variant === 'premium';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      setTriggerRect(containerRef.current.getBoundingClientRect());
    } else if (!isOpen) {
      setTriggerRect(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleUpdate = () => {
      if (containerRef.current) {
        setTriggerRect(containerRef.current.getBoundingClientRect());
      }
    };
    
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable) {
      setSearchQuery('');
      // Focus search input after a brief delay
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div 
      ref={containerRef} 
      className={`custom-select-container ${disabled ? 'disabled' : ''}`} 
      style={{ position: 'relative', width: '100%', fontFamily: 'inherit' }}
    >
      {/* Hidden input for HTML5 form validation */}
      <input 
        type="text" 
        value={value} 
        onChange={() => {}} 
        required={required} 
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none', top: '50%', left: '50%' }}
      />
      
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isPremium ? '16px 20px' : '10px 14px',
          fontSize: isPremium ? '15px' : '14px',
          borderRadius: isPremium ? '18px' : '10px',
          border: isOpen 
            ? (isPremium ? '2px solid #70309f' : '1.5px solid #70309f') 
            : (isPremium ? '2px solid #f1f5f9' : '1.5px solid #e2e8f0'),
          background: disabled ? '#f1f5f9' : '#f8fafc',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: selectedOption ? '#1e293b' : '#64748b',
          transition: 'all 0.25s ease',
          boxShadow: isOpen ? '0 0 0 4px rgba(112, 48, 159, 0.06)' : 'none',
          userSelect: 'none',
          width: '100%',
          boxSizing: 'border-box',
          fontWeight: isPremium ? '500' : 'normal'
        }}
      >
        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={isPremium ? 18 : 16} 
          style={{ 
            color: '#64748b', 
            transition: 'transform 0.2s', 
            transform: isOpen ? 'rotate(180deg)' : 'none',
            flexShrink: 0
          }} 
        />
      </div>

      {isOpen && (
        <div 
          className="custom-select-dropdown" 
          style={{
            position: 'fixed',
            left: triggerRect ? `${triggerRect.left}px` : '0px',
            width: triggerRect ? `${triggerRect.width}px` : '100%',
            ...(placement === 'top' 
              ? { top: triggerRect ? `${triggerRect.top - 6}px` : '0px', transform: 'translateY(-100%)' } 
              : { top: triggerRect ? `${triggerRect.bottom + 6}px` : '0px' }
            ),
            visibility: triggerRect ? 'visible' : 'hidden',
            background: '#ffffff',
            border: isPremium ? '2px solid #70309f' : '1.5px solid #70309f',
            borderRadius: isPremium ? '16px' : '12px',
            boxShadow: '0 12px 24px -4px rgba(112, 48, 159, 0.12), 0 4px 12px -2px rgba(112, 48, 159, 0.05)',
            zIndex: 99999,
            padding: '6px',
            boxSizing: 'border-box'
          }}
        >
          {/* Search container */}
          {searchable && (
            <div style={{ position: 'relative', marginBottom: '6px' }}>
              <Search 
                size={isPremium ? 16 : 14} 
                style={{ 
                  position: 'absolute', 
                  left: isPremium ? '12px' : '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#94a3b8' 
                }} 
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: isPremium ? '10px 10px 10px 36px' : '8px 8px 8px 30px',
                  fontSize: isPremium ? '14px' : '13px',
                  borderRadius: isPremium ? '12px' : '8px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  background: '#f8fafc',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#70309f';
                  e.target.style.background = '#ffffff';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.background = '#f8fafc';
                }}
              />
            </div>
          )}

          {/* Options list container */}
          <div 
            style={{ 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '2px', 
              maxHeight: isPremium ? '200px' : '160px' 
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    style={{
                      padding: isPremium ? '10px 14px' : '8px 12px',
                      fontSize: isPremium ? '14px' : '13px',
                      borderRadius: isPremium ? '10px' : '6px',
                      cursor: 'pointer',
                      background: isSelected ? '#70309f' : 'transparent',
                      color: isSelected ? '#ffffff' : '#334155',
                      fontWeight: isSelected ? '600' : 'normal',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#f3e8ff';
                        e.currentTarget.style.color = '#70309f';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#334155';
                      }
                    }}
                  >
                    {opt.label}
                  </div>
                );
              })
            ) : (
              <div 
                style={{ 
                  padding: '8px 12px', 
                  fontSize: isPremium ? '14px' : '13px', 
                  color: '#94a3b8', 
                  textAlign: 'center' 
                }}
              >
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
