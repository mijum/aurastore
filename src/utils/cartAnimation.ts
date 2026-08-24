const CART_TARGET_SELECTOR = '[data-cart-animation-target]';

const isVisible = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
};

const getCartTarget = (): HTMLElement | null => {
  return Array.from(document.querySelectorAll<HTMLElement>(CART_TARGET_SELECTOR)).find(isVisible) || null;
};

const cubicPoint = (
  start: number,
  controlOne: number,
  controlTwo: number,
  end: number,
  progress: number
) => {
  const inverse = 1 - progress;
  return (
    inverse * inverse * inverse * start +
    3 * inverse * inverse * progress * controlOne +
    3 * inverse * progress * progress * controlTwo +
    progress * progress * progress * end
  );
};

const createFlyingClone = (source: HTMLElement, imageUrl: string, alt: string) => {
  const rect = source.getBoundingClientRect();
  const shell = document.createElement('div');
  shell.className = 'flying-product-shell';
  shell.setAttribute('aria-hidden', 'true');
  Object.assign(shell.style, {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  });

  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = alt;
  image.className = 'flying-product-image';

  const creaseOne = document.createElement('span');
  creaseOne.className = 'flying-product-crease flying-product-crease-one';
  const creaseTwo = document.createElement('span');
  creaseTwo.className = 'flying-product-crease flying-product-crease-two';

  shell.append(image, creaseOne, creaseTwo);
  document.body.appendChild(shell);
  return { shell, rect };
};

const animateCartImpact = (target: HTMLElement) => {
  target.classList.remove('cart-impact');
  void target.offsetWidth;
  target.classList.add('cart-impact');
  const badge = target.querySelector<HTMLElement>('[data-cart-badge]');
  if (badge) {
    badge.classList.remove('cart-badge-impact');
    void badge.offsetWidth;
    badge.classList.add('cart-badge-impact');
  }

  const targetRect = target.getBoundingClientRect();
  const ring = document.createElement('span');
  ring.className = 'cart-impact-ring';
  ring.setAttribute('aria-hidden', 'true');
  Object.assign(ring.style, {
    left: `${targetRect.left + targetRect.width / 2}px`,
    top: `${targetRect.top + targetRect.height / 2}px`,
  });
  document.body.appendChild(ring);

  window.setTimeout(() => {
    target.classList.remove('cart-impact');
    badge?.classList.remove('cart-badge-impact');
    ring.remove();
  }, 620);
};

interface FlyProductOptions {
  source: HTMLElement;
  imageUrl: string;
  productName: string;
  onImpact: () => void;
}

export const flyProductToCart = async ({
  source,
  imageUrl,
  productName,
  onImpact,
}: FlyProductOptions): Promise<void> => {
  const target = getCartTarget();
  if (!target) {
    onImpact();
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { shell, rect: sourceRect } = createFlyingClone(source, imageUrl, productName);
  const targetRect = target.getBoundingClientRect();
  const startCenterX = sourceRect.left + sourceRect.width / 2;
  const startCenterY = sourceRect.top + sourceRect.height / 2;
  const deltaX = targetRect.left + targetRect.width / 2 - startCenterX;
  const deltaY = targetRect.top + targetRect.height / 2 - startCenterY;
  const availableDrop = Math.max(44, window.innerHeight - startCenterY - 42);
  const controlOneX = deltaX * 0.2;
  const controlOneY = Math.min(145, availableDrop * 0.82);
  const controlTwoX = deltaX * 0.78;
  const controlTwoY = Math.min(82, availableDrop * 0.5);

  const getTrajectoryPoint = (progress: number) => ({
    x: cubicPoint(0, controlOneX, controlTwoX, deltaX, progress),
    y: cubicPoint(0, controlOneY, controlTwoY, deltaY, progress),
  });

  try {
    if (prefersReducedMotion) {
      const reducedFrames = [0, 0.22, 0.48, 0.72, 0.88, 1].map((progress) => {
        const point = getTrajectoryPoint(progress);
        const scale = 1 - progress * 0.92;
        return {
          offset: progress,
          opacity: progress > 0.88 ? 1 - (progress - 0.88) / 0.12 : 1,
          transform: `translate3d(${point.x}px, ${point.y}px, 0) scale(${scale}) rotate(${progress * 24 - 5}deg)`,
          borderRadius: `${12 + progress * 38}%`,
        };
      });

      await shell.animate(
        reducedFrames,
        { duration: 900, easing: 'cubic-bezier(0.2, 0.72, 0.22, 1)', fill: 'forwards' }
      ).finished;
      onImpact();
      animateCartImpact(target);
      return;
    }

    const ballSize = Math.min(38, Math.max(28, Math.min(sourceRect.width, sourceRect.height) * 0.16));
    const foldedScale = ballSize / Math.max(sourceRect.width, sourceRect.height);

    await shell.animate(
      [
        {
          offset: 0,
          transform: 'perspective(900px) scale(1) rotate(0deg) rotateX(0deg) rotateY(0deg)',
          borderRadius: '12px',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          filter: 'brightness(1) saturate(1)',
        },
        {
          offset: 0.2,
          transform: 'perspective(900px) scaleX(0.72) scaleY(0.96) rotate(-2deg) rotateY(48deg)',
          borderRadius: '14% 5% 12% 8%',
          clipPath: 'polygon(18% 0, 100% 7%, 93% 100%, 3% 91%)',
          filter: 'brightness(0.98) saturate(1.08)',
        },
        {
          offset: 0.4,
          transform: 'perspective(900px) scaleX(0.7) scaleY(0.62) rotate(3deg) rotateX(-52deg) rotateY(22deg)',
          borderRadius: '9% 22% 8% 19%',
          clipPath: 'polygon(8% 13%, 91% 0, 100% 78%, 19% 100%, 0 52%)',
          filter: 'brightness(0.92) contrast(1.08) saturate(1.12)',
        },
        {
          offset: 0.62,
          transform: `perspective(900px) scale(${Math.max(foldedScale * 2.8, 0.2)}) rotate(-9deg) rotateX(61deg) rotateY(-47deg)`,
          borderRadius: '31% 18% 39% 24%',
          clipPath: 'polygon(21% 0, 88% 15%, 100% 67%, 69% 100%, 11% 84%, 0 28%)',
          filter: 'brightness(0.88) contrast(1.16) saturate(1.2)',
        },
        {
          offset: 0.82,
          transform: `perspective(900px) scale(${Math.max(foldedScale * 1.45, 0.1)}) rotate(13deg) rotateX(-34deg) rotateY(58deg)`,
          borderRadius: '42% 55% 38% 61%',
          clipPath: 'polygon(28% 0, 78% 9%, 100% 43%, 83% 87%, 44% 100%, 5% 72%, 0 31%)',
          filter: 'brightness(0.9) contrast(1.2) saturate(1.25)',
        },
        {
          offset: 1,
          transform: `perspective(900px) scale(${foldedScale}) rotate(24deg) rotateX(18deg) rotateY(-22deg)`,
          borderRadius: '48% 52% 44% 56%',
          clipPath: 'polygon(31% 0, 76% 8%, 100% 38%, 91% 78%, 61% 100%, 19% 91%, 0 58%, 8% 21%)',
          filter: 'brightness(0.94) contrast(1.2) saturate(1.22)',
        },
      ],
      { duration: 430, easing: 'cubic-bezier(0.32, 0, 0.2, 1)', fill: 'forwards' }
    ).finished;

    const flightFrames = [0, 0.18, 0.42, 0.68, 0.86, 1].map((progress) => {
      const { x, y } = getTrajectoryPoint(progress);
      const scale = foldedScale * (1 - progress * 0.48);
      return {
        offset: progress,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${24 + progress * 520}deg)`,
        opacity: progress > 0.86 ? 1 - (progress - 0.86) / 0.14 : 1,
        filter: `brightness(${0.94 + progress * 0.12}) contrast(1.2) saturate(1.22)`,
      };
    });

    await shell.animate(flightFrames, {
      duration: 690,
      easing: 'cubic-bezier(0.2, 0.72, 0.22, 1)',
      fill: 'forwards',
    }).finished;

    onImpact();
    animateCartImpact(target);
  } finally {
    shell.remove();
  }
};
