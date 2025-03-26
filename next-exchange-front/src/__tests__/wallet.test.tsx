import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Wallet from "../components/wallet";
import { useWallet } from "../hooks/walletHook";
import { usePathname } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en-us.json";
import pt from "../../messages/pt-br.json";
import es from "../../messages/es-pe.json";

vi.mock("../hooks/walletHook", () => ({ useWallet: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

describe("Wallet Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading and static inputs", () => {
    (useWallet as vi.mock).mockReturnValue({
      walletData: { usd: 123.45, gbp: 67.89 },
      loading: false,
      error: null,
    });
    (usePathname as vi.mock).mockReturnValue("/en-us/dashboard");
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Wallet reloadTrigger={true} onChangeValue={vi.fn()} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("My wallet")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("USD")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("GBP")).toBeInTheDocument();
  });

  it("renders heading and static inputs in pt-br", () => {
    (useWallet as vi.mock).mockReturnValue({
      walletData: { usd: 123.45, gbp: 67.89 },
      loading: false,
      error: null,
    });
    (usePathname as vi.mock).mockReturnValue("/en-us/dashboard");
    render(
      <NextIntlClientProvider locale="pt-br" messages={pt}>
        <Wallet reloadTrigger={true} onChangeValue={vi.fn()} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Minha carteira")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("USD")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("GBP")).toBeInTheDocument();
  });

  it("renders heading and static inputs in es-pe", () => {
    (useWallet as vi.mock).mockReturnValue({
      walletData: { usd: 123.45, gbp: 67.89 },
      loading: false,
      error: null,
    });
    (usePathname as vi.mock).mockReturnValue("/en-us/dashboard");
    render(
      <NextIntlClientProvider locale="es-pe" messages={es}>
        <Wallet reloadTrigger={true} onChangeValue={vi.fn()} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Mi billetera")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("USD")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("GBP")).toBeInTheDocument();
  });

  it("renders wallet amounts when loading is false", () => {
    (useWallet as vi.mock).mockReturnValue({
      walletData: { usd: 123.45, gbp: 67.89 },
      loading: false,
      error: null,
    });
    (usePathname as vi.mock).mockReturnValue("/en-us/dashboard");
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Wallet reloadTrigger={true} onChangeValue={vi.fn()} />
      </NextIntlClientProvider>
    );
    expect(screen.getByPlaceholderText("123.45$")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("£67.89")).toBeInTheDocument();
  });

  it("renders loading placeholders when loading is true", () => {
    (useWallet as vi.mock).mockReturnValue({
      walletData: null,
      loading: true,
      error: null,
    });
    (usePathname as vi.mock).mockReturnValue("/en-us/dashboard");
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Wallet reloadTrigger={true} onChangeValue={vi.fn()} />
      </NextIntlClientProvider>
    );
    expect(screen.getByPlaceholderText("Loading...$")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("£Loading...")).toBeInTheDocument();
  });

  it("renders Exchange button when location is /dashboard and calls onChangeValue when clicked", async () => {
    const onChangeValue = vi.fn();
    (useWallet as vi.mock).mockReturnValue({
      walletData: { usd: 123.45, gbp: 67.89 },
      loading: false,
      error: null,
    });
    (usePathname as vi.mock).mockReturnValue("/en-us/dashboard");
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Wallet reloadTrigger={true} onChangeValue={onChangeValue} />
      </NextIntlClientProvider>
    );
    const button = screen.getByText("Add funds");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    await waitFor(() => {
      expect(onChangeValue).toHaveBeenCalledWith(true);
    });
  });

  it("does not render Exchange button when location is not /dashboard", () => {
    (useWallet as vi.mock).mockReturnValue({
      walletData: { usd: 123.45, gbp: 67.89 },
      loading: false,
      error: null,
    });
    (usePathname as vi.mock).mockReturnValue("/other");
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Wallet reloadTrigger={true} onChangeValue={vi.fn()} />
      </NextIntlClientProvider>
    );
    expect(screen.queryByText("Add funds")).not.toBeInTheDocument();
  });
});
