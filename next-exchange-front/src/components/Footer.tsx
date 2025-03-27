import Link from "next/link";
import { usePathname } from 'next/navigation'

function Footer() {
    const location = usePathname();
    const handleLang = (lang: string) => {
        const regex = /[^/]+$/
        const match = location.match(regex)
        if(match == "en-us" || match == "es-pe" || match == "pt-br"){
            return `/${lang}`
        }
        return `/${lang}/${match}`
    }

    return ( 
    <footer className="flex justify-center items-center w-full text-xl text-black underline gap-8  h-8 mt-4">
        <Link href={handleLang("en-us")}>en-us</Link>
        <Link href={handleLang("pt-br")}>pt-br</Link>
        <Link href={handleLang("es-pe")}>es-pe</Link>
    </footer> 
    );
}

export default Footer;