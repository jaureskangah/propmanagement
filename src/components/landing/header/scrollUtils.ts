
export const scrollToSection = (sectionId: string) => {
  const section = document.querySelector(`#${sectionId}`);
  if (section) {
    const headerHeight = 64;
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
    
    return true;
  }
  return false;
};
