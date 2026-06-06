import Link from "next/link"

export function FooterAvant() {
  return (
    <footer className="mt-14 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-10 sm:py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div className="space-y-2">
            <div className="font-semibold">Mutiny</div>
            <p className="text-white/60">Two AIs. One mission: align people and capital around real ideas.</p>
          </div>
          <div>
            <div className="font-semibold">Product</div>
            <ul className="mt-2 space-y-2 text-white/70">
              <li>
                <Link href="#match" className="hover:text-white">
                  Align
                </Link>
              </li>
              <li>
                <Link href="#duo" className="hover:text-white">
                  Duo
                </Link>
              </li>
              <li>
                <Link href="#funding" className="hover:text-white">
                  Funding
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Trust</div>
            <ul className="mt-2 space-y-2 text-white/70">
              <li>Mutual NDAs by default</li>
              <li>On-chain idea hashing</li>
              <li>Privacy-first matching</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Legal</div>
            <ul className="mt-2 space-y-2 text-white/70">
              <li>Terms</li>
              <li>Privacy</li>
              <li>Security</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-xs text-white/50">© {new Date().getFullYear()} Mutiny. All rights reserved.</div>
      </div>
    </footer>
  )
}
