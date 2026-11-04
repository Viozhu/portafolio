import { useEffect } from "react";

/** Rows and plates that power on, with a stutter, the first time they scroll in. */
export const usePowerOn = () => {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-power]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-on"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-on");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};
