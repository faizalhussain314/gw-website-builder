/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

/**
 * Types for GoogleSignInButton Component
 */
type GoogleSignInButtonProps = {
  /**
   * Width of the button in pixels
   */
  width: number;

  /**
   * Listener for successful google login.
   * @param credentialToken JWT token of the logged google user
   * @returns void
   */
  onLogin: (credentialToken: string) => void;
};

/**
 * Google sign in button component to allow user to login using google account.
 */
export default function GoogleSignInButton(props: GoogleSignInButtonProps) {
  const { width, onLogin } = props;

  const buttonContainerRef = useRef<HTMLDivElement>(null);

  /**
   * After component mount init google api and render login button
   */
  useEffect(() => {
    const google: any = (window as any).google;

    google?.accounts?.id?.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (data: any) => {
        onLogin(data.credential);
      },
    });

    google?.accounts?.id?.renderButton(buttonContainerRef.current, {
      theme: "filled_blue",
      width: width,
    });

    google?.accounts?.id?.prompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={buttonContainerRef} className="w-fit"></div>;
}

GoogleSignInButton.defaultProps = {
  width: 300,
};
