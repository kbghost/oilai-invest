import React, { useState, useEffect, useRef } from 'react';
import { parsePhoneNumberFromString, isPossiblePhoneNumber } from 'libphonenumber-js/max';
import { WORLD_COUNTRIES, searchCountries } from '../../data/countries';
import { Search, ChevronDown, Check, X, Globe } from 'lucide-react';

export default function PhoneInput({
  selectedCountry,
  onCountryChange,
  phoneValue,
  onPhoneChange,
  onValidationChange,
  detectedCountryName,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(WORLD_COUNTRIES);
  const [phoneError, setPhoneError] = useState(null);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const searchInputRef = useRef(null);

  // Filter country list on search query change
  useEffect(() => {
    setFilteredCountries(searchCountries(searchQuery));
  }, [searchQuery]);

  // Focus search input on modal open
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  }, [isModalOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Validate phone number with libphonenumber-js (isValid or isPossible fallback)
  useEffect(() => {
    if (!phoneValue || phoneValue.trim() === '') {
      setPhoneError(null);
      setIsValidPhone(false);
      if (onValidationChange) onValidationChange({ isValid: false, e164: '' });
      return;
    }

    const cleanInput = phoneValue.trim();
    let phoneNumber = null;

    try {
      if (cleanInput.startsWith('+')) {
        phoneNumber = parsePhoneNumberFromString(cleanInput);
      } else {
        phoneNumber = parsePhoneNumberFromString(cleanInput, selectedCountry.code);
      }
    } catch (err) {
      phoneNumber = null;
    }

    const digitsOnly = cleanInput.replace(/\D/g, '');
    const isPossible =
      (phoneNumber && (phoneNumber.isValid() || phoneNumber.isPossible())) ||
      (cleanInput.startsWith('+') ? isPossiblePhoneNumber(cleanInput) : digitsOnly.length >= 7 && digitsOnly.length <= 15);

    if (isPossible) {
      setPhoneError(null);
      setIsValidPhone(true);
      const e164 = phoneNumber && phoneNumber.format('E.164')
        ? phoneNumber.format('E.164')
        : cleanInput.startsWith('+') ? `+${digitsOnly}` : `${selectedCountry.dialCode}${digitsOnly}`;

      if (onValidationChange) {
        onValidationChange({
          isValid: true,
          e164: e164,
          countryCode: (phoneNumber && phoneNumber.country) || selectedCountry.code,
        });
      }
    } else {
      setIsValidPhone(false);
      const errorMsg = `Invalid phone number for: ${selectedCountry.name}`;
      setPhoneError(errorMsg);
      if (onValidationChange) {
        onValidationChange({
          isValid: false,
          e164: cleanInput.startsWith('+') ? cleanInput : `${selectedCountry.dialCode}${digitsOnly}`,
          countryCode: selectedCountry.code,
        });
      }
    }
  }, [phoneValue, selectedCountry]);

  const handleSelectCountry = (country) => {
    onCountryChange(country);
    setIsModalOpen(false);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Field Label */}
      <label className="label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Phone Number</span>
        {isValidPhone && (
          <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Check size={13} strokeWidth={3} /> Valid number
          </span>
        )}
      </label>

      {/* Main Phone Input Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: 14,
          border: phoneError ? '1.5px solid var(--red)' : isValidPhone ? '1.5px solid var(--green)' : '1px solid var(--border)',
          background: 'var(--bg-card2)',
          overflow: 'hidden',
          minHeight: 48,
          transition: 'all 0.2s ease',
          boxShadow: isModalOpen ? '0 0 0 3px var(--accent-glow)' : 'none',
        }}
      >
        {/* Part 1: Country Button (Flag + Dial Code + Arrow) */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0.75rem 0.875rem',
            minHeight: 48,
            background: 'rgba(255,255,255,0.04)',
            border: 'none',
            borderRight: '1px solid var(--border)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 700,
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            transition: 'background 0.15s ease',
          }}
          title={`Selected country: ${selectedCountry.name} (${selectedCountry.dialCode})`}
        >
          <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{selectedCountry.flag}</span>
          <span style={{ fontFamily: 'monospace', letterSpacing: '-0.02em' }}>{selectedCountry.dialCode}</span>
          <ChevronDown size={15} style={{ color: 'var(--text-muted)', marginLeft: 2 }} />
        </button>

        {/* Part 2: Phone Input Field */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="tel"
            inputMode="tel"
            value={phoneValue}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="Enter your phone number"
            className="input"
            style={{
              border: 'none',
              borderRadius: 0,
              background: 'transparent',
              paddingLeft: '0.875rem',
              paddingRight: isValidPhone || phoneError ? '2.5rem' : '0.875rem',
              width: '100%',
              minHeight: 48,
              fontSize: '1rem',
              fontFamily: 'monospace',
            }}
          />
          {isValidPhone && (
            <div style={{ position: 'absolute', right: 12, color: 'var(--green)', display: 'flex', alignItems: 'center' }}>
              <Check size={18} strokeWidth={2.5} />
            </div>
          )}
          {phoneError && (
            <div style={{ position: 'absolute', right: 12, color: 'var(--red)', display: 'flex', alignItems: 'center' }} title={phoneError}>
              <X size={18} strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {phoneError && (
        <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 6, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          ❌ {phoneError}
        </p>
      )}

      {/* ── WORLDWIDE COUNTRY SELECTOR MODAL ── */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease forwards',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              maxHeight: '82vh',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'slideUp 0.25s ease forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.15rem 1.25rem 0.85rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  Select your country
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  All world countries ({WORLD_COUNTRIES.length}) · Sorted alphabetically
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'var(--bg-card2)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-card2)' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, color: 'var(--text-muted)' }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔎 Search country (e.g. France, +229, BJ, Nigeria)..."
                  className="input"
                  style={{
                    paddingLeft: 38,
                    fontSize: '0.9rem',
                    borderRadius: 12,
                    background: 'var(--bg-card)',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: 12,
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Modal Country List (Scrollable) */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0.5rem',
                maxHeight: 380,
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {filteredCountries.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  <Globe size={28} style={{ opacity: 0.5, marginBottom: 8 }} />
                  <p>No country found for "{searchQuery}"</p>
                </div>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected = selectedCountry.code === c.code;
                  return (
                    <button
                      key={`${c.code}-${c.dialCode}`}
                      type="button"
                      onClick={() => handleSelectCountry(c)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.7rem 0.85rem',
                        borderRadius: 12,
                        border: isSelected ? '1px solid var(--accent)' : '1px solid transparent',
                        background: isSelected ? 'var(--accent-glow)' : 'transparent',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        fontSize: '0.9rem',
                        transition: 'all 0.15s ease',
                        marginBottom: 2,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'var(--bg-card2)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                        <span style={{ fontSize: '1.35rem', lineHeight: 1, flexShrink: 0 }}>{c.flag}</span>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: isSelected ? 700 : 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.name}
                          </p>
                          <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '1px 0 0' }}>
                            ISO: {c.code} · {c.iso3}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }}>
                          {c.dialCode}
                        </span>
                        {isSelected && <Check size={16} color="var(--accent)" strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
