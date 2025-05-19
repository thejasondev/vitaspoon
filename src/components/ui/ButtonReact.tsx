import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  children: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const ButtonReact: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  href,
  className = "",
  variant = "primary",
  size = "md",
  icon = false,
  iconPosition = "right",
  fullWidth = false,
  disabled = false,
  children,
  iconLeft,
  iconRight,
  ...rest
}) => {
  // Base classes compartidas
  const baseClasses =
    "font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center";

  // Variantes de estilo
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white",
    secondary:
      "bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white",
    outline:
      "bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50",
  };

  // Tamaños
  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6",
    lg: "py-3 px-8 text-lg",
  };

  // Anchura completa
  const widthClass = fullWidth ? "w-full" : "";

  // Estilos para disabled
  const disabledClasses = disabled
    ? "opacity-70 cursor-not-allowed hover:transform-none"
    : "";

  // Clase final
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClasses} ${className}`;

  // Renderizado condicional basado en href
  if (href) {
    return (
      <a href={href} className={buttonClasses} {...rest}>
        {icon && iconPosition === "left" && iconLeft}
        {children}
        {icon &&
          iconPosition === "right" &&
          (iconRight || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ))}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
      {...rest}
    >
      {icon && iconPosition === "left" && iconLeft}
      {children}
      {icon &&
        iconPosition === "right" &&
        (iconRight || (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        ))}
    </button>
  );
};

export default ButtonReact;
