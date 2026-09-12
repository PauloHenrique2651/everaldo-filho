import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, CreditCard, MessageCircle, ShieldCheck, X, QrCode, Repeat2, Barcode } from 'lucide-react';
import { formatPrice, paymentOptions } from '../data/plans';
import { track } from '../lib/analytics';

const phone = '5521975769161';

export default function CheckoutDialog({ plan, onClose }) {
  const previousFocus = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (!plan) return undefined;
    previousFocus.current = document.activeElement;
    setPayment(null);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = event => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key === 'Tab') {
        const items = [...dialogRef.current.querySelectorAll('button:not(:disabled), a[href], input')];
        const first = items[0], last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const siblings = [...document.getElementById('root').children].filter(el => !el.classList.contains('checkout-backdrop'));
    const inertState = siblings.map(el => el.inert);
    siblings.forEach(el => { el.inert = true; });
    dialogRef.current.querySelector('button').focus();
    addEventListener('keydown', onKey);
    track('checkout_started', { plan_id: plan.id, category: plan.category, tier: plan.tier });
    return () => {
      removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      siblings.forEach((el, index) => { el.inert = inertState[index]; });
      previousFocus.current?.focus?.();
    };
  }, [plan]);

  if (!plan) return null;
  const category = plan.category === 'guitar' ? 'Guitarra' : 'Canto';
  const message = plan.tier === 'pro'
    ? 'Olá, Everaldo! Tenho interesse no Plano Pro e gostaria de saber mais sobre o acompanhamento e as aulas ao vivo.'
    : `Olá, Everaldo! Vi o Studio Everaldo Filho e tenho interesse no Plano ${plan.name} de ${category}. Quero entender melhor como funciona.`;
  const whatsapp = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return <div className="checkout-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} className="checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title" aria-describedby="checkout-availability">
      <button className="checkout-close" onClick={onClose} aria-label="Fechar checkout"><X /></button>
      <div className="checkout-steps" aria-label="Etapas do checkout">
        {['Plano', 'Conta', 'Pagamento', 'Confirmação'].map((step, index) => <span aria-current={index === 0 ? 'step' : undefined} className={index === 0 ? 'is-active' : ''} key={step}><b>0{index + 1}</b>{step}</span>)}
      </div>
      <div className="checkout-main">
        <div className="checkout-copy">
          <span>PRÉ-CHECKOUT / STUDIO</span>
          <h2 id="checkout-title">Seu próximo passo<br />já tem <em>direção.</em></h2>
          <p id="checkout-availability">As assinaturas ainda não estão abertas. Confira seu plano e conheça as formas de pagamento previstas.</p>
          <fieldset className="payment-options"><legend>Conheça cada forma de pagamento</legend>
            {paymentOptions.map((option, index) => {
              const Icon = [CreditCard, Repeat2, QrCode, Barcode][index];
              return <button type="button" key={option.id} aria-pressed={payment === option.id} onClick={() => setPayment(option.id)}><Icon aria-hidden="true" /><span><strong>{option.name}</strong><small>{option.description}</small>{option.reserved && <b>EM PREPARAÇÃO · RECORRÊNCIA PIX</b>}</span>{payment === option.id && <Check aria-hidden="true" />}</button>;
            })}
          </fieldset>
          <p className="payment-detail" aria-live="polite">{paymentOptions.find(option => option.id === payment)?.detail || 'Toque em uma opção para entender como funciona. Nenhuma cobrança será criada.'}</p>
          <div className="checkout-notice"><ShieldCheck /><p><strong>Inscrições em preparação</strong>Os valores são demonstrativos. Everaldo confirma condições e disponibilidade pelo WhatsApp.</p></div>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="checkout-primary" onClick={() => track('whatsapp_clicked', { source: 'checkout', plan_id: plan.id })}>
            <MessageCircle /> Conversar sobre este plano <ArrowRight />
          </a>
        </div>
        <aside className="checkout-summary">
          <span>SEU PLANO</span>
          <h3>{plan.name} <small>— {category}</small></h3>
          <div className="plan-price"><strong>{formatPrice(plan.monthlyPrice)}</strong><small>/mês</small></div>
          <p>Valor demonstrativo para configuração da oferta.</p>
          <ul>{plan.benefits.slice(0, 3).map(benefit => <li key={benefit}><Check />{benefit}</li>)}</ul>
          <footer><ShieldCheck /> Processamento previsto com Asaas</footer>
        </aside>
      </div>
    </section>
  </div>;
}
