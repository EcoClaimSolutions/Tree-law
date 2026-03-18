"use client"

export function AppFooter() {
  return (
    <footer className="mt-12 py-6 border-t" style={{ borderColor: "#003c46" }}>
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-2">
        <p className="text-sm" style={{ color: "#003c46" }}>
          © {new Date().getFullYear()} Tree Law. All rights reserved.
        </p>
        <p className="text-sm" style={{ color: "#003c46" }}>
          Powered by{" "}
          <a
            href="https://www.ecoclaim.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
            style={{ color: "#6bb6c4" }}
          >
            EcoClaim
          </a>
        </p>
      </div>
    </footer>
  )
}
