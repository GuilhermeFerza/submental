import { Link } from 'react-router-dom';

export function Header(){
    return (
    <header className="flex items-center justify-between p-6 border-b-2 border-white/10">
      <Link to="/" className="font-extrabold text-3xl tracking-tighter uppercase cursor-pointer hover:text-gray-300 transition-colors">
        Submental
      </Link>
      <nav>
        <ul className="flex gap-8 font-bold text-sm md:text-base tracking-widest uppercase">
          <li><Link to="/releases" className="hover:line-through cursor-pointer">Releases</Link></li>
          <li><Link to="/events" className="hover:line-through cursor-pointer">Events</Link></li>
        </ul>
      </nav>
    </header>
  );
}