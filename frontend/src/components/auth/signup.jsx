/**
 * COMPOSANT SIGNUP MODAL avec i18n - FORMULAIRE 3 ÉTAPES
 * Étape 1: Cabinet | Étape 2: Médecin | Étape 3: Secrétaire + Plan paiement
 */

import { useState } from 'react';
import { useTranslation } from '../../i18n';

export default function SignupModal({ onClose }) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [cabinetData, setCabinetData] = useState({
    cabinetName: '',
    cabinetAddress: '',
    cabinetCity: '',
    cabinetZipCode: '',
    cabinetPhone: '',
    cabinetLicense: '',
  });

  const [doctorData, setDoctorData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: '',
    password: '',
    confirmPassword: '',
  });

  const [secretaryData, setSecretaryData] = useState({
    secretaryFirstName: '',
    secretaryLastName: '',
    secretaryEmail: '',
    secretaryPhone: '',
    paymentPlan: 'monthly',
  });

  const [errors, setErrors] = useState({});

  const validateCabinetStep = () => {
    const newErrors = {};
    if (!cabinetData.cabinetName.trim()) newErrors.cabinetName = t('signup.errors.required');
    if (!cabinetData.cabinetAddress.trim()) newErrors.cabinetAddress = t('signup.errors.required');
    if (!cabinetData.cabinetCity.trim()) newErrors.cabinetCity = t('signup.errors.required');
    if (!cabinetData.cabinetZipCode.trim()) newErrors.cabinetZipCode = t('signup.errors.required');
    if (!cabinetData.cabinetPhone.trim()) newErrors.cabinetPhone = t('signup.errors.required');
    if (!cabinetData.cabinetLicense.trim()) newErrors.cabinetLicense = t('signup.errors.required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDoctorStep = () => {
    const newErrors = {};
    if (!doctorData.firstName.trim()) newErrors.firstName = t('signup.errors.required');
    if (!doctorData.lastName.trim()) newErrors.lastName = t('signup.errors.required');
    if (!doctorData.email.trim() || !/\S+@\S+\.\S+/.test(doctorData.email)) newErrors.email = t('signup.errors.invalidEmail');
    if (!doctorData.phone.trim()) newErrors.phone = t('signup.errors.required');
    if (!doctorData.specialty) newErrors.specialty = t('signup.errors.required');
    if (!doctorData.password.trim() || doctorData.password.length < 8) newErrors.password = t('signup.errors.passwordLength');
    if (doctorData.password !== doctorData.confirmPassword) newErrors.confirmPassword = t('signup.errors.passwordMismatch');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSecretaryStep = () => {
    const newErrors = {};
    if (!secretaryData.secretaryFirstName.trim()) newErrors.secretaryFirstName = t('signup.errors.required');
    if (!secretaryData.secretaryLastName.trim()) newErrors.secretaryLastName = t('signup.errors.required');
    if (!secretaryData.secretaryEmail.trim() || !/\S+@\S+\.\S+/.test(secretaryData.secretaryEmail)) newErrors.secretaryEmail = t('signup.errors.invalidEmail');
    if (!secretaryData.secretaryPhone.trim()) newErrors.secretaryPhone = t('signup.errors.required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    let isValid = false;
    if (currentStep === 0) isValid = validateCabinetStep();
    else if (currentStep === 1) isValid = validateDoctorStep();
    if (isValid) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateSecretaryStep()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(t('signup.success'));
      onClose();
    } catch  {
      setErrors({ submit: t('signup.errors.submitError') });
    } finally {
      setIsLoading(false);
    }
  };

  const TextField = ({ label, value, onChange, placeholder, type = 'text', error }) => (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                error ? 'border-red-500' : 'border-slate-300'
            }`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
  );

  return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{t('signup.title')}</h2>
              <p className="text-sm text-slate-600 mt-1">
                {t('signup.step')} {currentStep + 1} {t('signup.of')} 3
              </p>
            </div>
            <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            >
              ✕
            </button>
          </div>

          <div className="px-6 pt-6">
            <div className="flex gap-2">
              {[0, 1, 2].map((step) => (
                  <div
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-all ${
                          step <= currentStep ? 'bg-cyan-500' : 'bg-slate-200'
                      }`}
                  />
              ))}
            </div>
          </div>

          <div className="p-6">
            {currentStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">
                    📋 {t('signup.steps.cabinet')}
                  </h3>
                  <TextField
                      label={t('signup.cabinet.name')}
                      value={cabinetData.cabinetName}
                      onChange={(e) => setCabinetData({ ...cabinetData, cabinetName: e.target.value })}
                      placeholder={t('signup.cabinet.namePlaceholder')}
                      error={errors.cabinetName}
                  />
                  <TextField
                      label={t('signup.cabinet.address')}
                      value={cabinetData.cabinetAddress}
                      onChange={(e) => setCabinetData({ ...cabinetData, cabinetAddress: e.target.value })}
                      placeholder={t('signup.cabinet.addressPlaceholder')}
                      error={errors.cabinetAddress}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <TextField
                        label={t('signup.cabinet.city')}
                        value={cabinetData.cabinetCity}
                        onChange={(e) => setCabinetData({ ...cabinetData, cabinetCity: e.target.value })}
                        placeholder={t('signup.cabinet.cityPlaceholder')}
                        error={errors.cabinetCity}
                    />
                    <TextField
                        label={t('signup.cabinet.zipCode')}
                        value={cabinetData.cabinetZipCode}
                        onChange={(e) => setCabinetData({ ...cabinetData, cabinetZipCode: e.target.value })}
                        placeholder={t('signup.cabinet.zipCodePlaceholder')}
                        error={errors.cabinetZipCode}
                    />
                  </div>
                  <TextField
                      label={t('signup.cabinet.phone')}
                      value={cabinetData.cabinetPhone}
                      onChange={(e) => setCabinetData({ ...cabinetData, cabinetPhone: e.target.value })}
                      placeholder={t('signup.cabinet.phonePlaceholder')}
                      error={errors.cabinetPhone}
                  />
                  <TextField
                      label={t('signup.cabinet.license')}
                      value={cabinetData.cabinetLicense}
                      onChange={(e) => setCabinetData({ ...cabinetData, cabinetLicense: e.target.value })}
                      placeholder={t('signup.cabinet.licensePlaceholder')}
                      error={errors.cabinetLicense}
                  />
                </div>
            )}

            {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">
                    👨‍⚕️ {t('signup.steps.doctor')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <TextField
                        label={t('signup.doctor.firstName')}
                        value={doctorData.firstName}
                        onChange={(e) => setDoctorData({ ...doctorData, firstName: e.target.value })}
                        placeholder={t('signup.doctor.firstNamePlaceholder')}
                        error={errors.firstName}
                    />
                    <TextField
                        label={t('signup.doctor.lastName')}
                        value={doctorData.lastName}
                        onChange={(e) => setDoctorData({ ...doctorData, lastName: e.target.value })}
                        placeholder={t('signup.doctor.lastNamePlaceholder')}
                        error={errors.lastName}
                    />
                  </div>
                  <TextField
                      label={t('signup.doctor.email')}
                      value={doctorData.email}
                      onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                      placeholder={t('signup.doctor.emailPlaceholder')}
                      type="email"
                      error={errors.email}
                  />
                  <TextField
                      label={t('signup.doctor.phone')}
                      value={doctorData.phone}
                      onChange={(e) => setDoctorData({ ...doctorData, phone: e.target.value })}
                      placeholder={t('signup.doctor.phonePlaceholder')}
                      error={errors.phone}
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t('signup.doctor.specialty')}
                    </label>
                    <select
                        value={doctorData.specialty}
                        onChange={(e) => setDoctorData({ ...doctorData, specialty: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.specialty ? 'border-red-500' : 'border-slate-300'}`}
                    >
                      <option value="">{t('signup.doctor.specialtyPlaceholder')}</option>
                      <option value="cardiology">{t('signup.doctor.specialties.cardiology')}</option>
                      <option value="dermatology">{t('signup.doctor.specialties.dermatology')}</option>
                      <option value="general">{t('signup.doctor.specialties.general')}</option>
                      <option value="orthopedics">{t('signup.doctor.specialties.orthopedics')}</option>
                    </select>
                    {errors.specialty && <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>}
                  </div>
                  <TextField
                      label={t('signup.doctor.password')}
                      value={doctorData.password}
                      onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                      placeholder={t('signup.doctor.passwordPlaceholder')}
                      type="password"
                      error={errors.password}
                  />
                  <TextField
                      label={t('signup.doctor.confirmPassword')}
                      value={doctorData.confirmPassword}
                      onChange={(e) => setDoctorData({ ...doctorData, confirmPassword: e.target.value })}
                      placeholder={t('signup.doctor.passwordPlaceholder')}
                      type="password"
                      error={errors.confirmPassword}
                  />
                </div>
            )}

            {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      👩‍💼 {t('signup.steps.secretary')}
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <TextField
                            label={t('signup.secretary.firstName')}
                            value={secretaryData.secretaryFirstName}
                            onChange={(e) => setSecretaryData({ ...secretaryData, secretaryFirstName: e.target.value })}
                            placeholder={t('signup.secretary.firstNamePlaceholder')}
                            error={errors.secretaryFirstName}
                        />
                        <TextField
                            label={t('signup.secretary.lastName')}
                            value={secretaryData.secretaryLastName}
                            onChange={(e) => setSecretaryData({ ...secretaryData, secretaryLastName: e.target.value })}
                            placeholder={t('signup.secretary.lastNamePlaceholder')}
                            error={errors.secretaryLastName}
                        />
                      </div>
                      <TextField
                          label={t('signup.secretary.email')}
                          value={secretaryData.secretaryEmail}
                          onChange={(e) => setSecretaryData({ ...secretaryData, secretaryEmail: e.target.value })}
                          placeholder={t('signup.secretary.emailPlaceholder')}
                          type="email"
                          error={errors.secretaryEmail}
                      />
                      <TextField
                          label={t('signup.secretary.phone')}
                          value={secretaryData.secretaryPhone}
                          onChange={(e) => setSecretaryData({ ...secretaryData, secretaryPhone: e.target.value })}
                          placeholder={t('signup.secretary.phonePlaceholder')}
                          error={errors.secretaryPhone}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      💳 {t('signup.payment.title')}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                          onClick={() => setSecretaryData({ ...secretaryData, paymentPlan: 'monthly' })}
                          className={`p-6 border-2 rounded-lg transition-all text-left ${
                              secretaryData.paymentPlan === 'monthly'
                                  ? 'border-cyan-500 bg-cyan-50'
                                  : 'border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{t('signup.payment.monthly.title')}</h4>
                          <span className={`${secretaryData.paymentPlan === 'monthly' ? 'text-cyan-500' : 'text-transparent'}`}>✓</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{t('signup.payment.monthly.price')}</p>
                        <p className="text-sm text-slate-600 mt-1">{t('signup.payment.monthly.period')}</p>
                      </button>

                      <button
                          onClick={() => setSecretaryData({ ...secretaryData, paymentPlan: 'annual' })}
                          className={`p-6 border-2 rounded-lg transition-all text-left relative ${
                              secretaryData.paymentPlan === 'annual'
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-slate-200 hover:border-slate-300'
                          }`}
                      >
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {t('signup.payment.annual.badge')}
                    </span>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{t('signup.payment.annual.title')}</h4>
                          <span className={`${secretaryData.paymentPlan === 'annual' ? 'text-blue-600' : 'text-transparent'}`}>✓</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{t('signup.payment.annual.price')}</p>
                        <p className="text-sm text-slate-600 mt-1">{t('signup.payment.annual.period')}</p>
                      </button>
                    </div>
                  </div>
                </div>
            )}
          </div>

          <div className="flex gap-3 p-6 border-t border-slate-200 sticky bottom-0 bg-white">
            {currentStep > 0 && (
                <button
                    onClick={goToPreviousStep}
                    className="px-6 py-2 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-all"
                >
                  ← {t('signup.buttons.previous')}
                </button>
            )}

            <button
                onClick={currentStep === 2 ? handleSubmit : goToNextStep}
                disabled={isLoading}
                className="ml-auto px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? t('signup.buttons.submitting') : currentStep === 2 ? t('signup.buttons.submit') : `${t('signup.buttons.next')} →`}
            </button>
          </div>
        </div>
      </div>
  );
}