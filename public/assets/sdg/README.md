# SDG icons

Two ways to supply the artwork. Both are official UN icons — nothing here is
drawn or generated, because an approximated official mark is worse than an
honest placeholder.

## Paired composites (what is in use)

The existing DigiGram site pairs two goals in one image, and those files are
here. The filename states the goals in the order they appear:

    goals-1-2.png      Rural poverty
    goals-5-10.png     Gender gap
    goals-11-10.png    Disability
    goals-13-12.png    Environment

To change a pairing, add a file named for the new combination and update the
`goals` array on that card in `app/[locale]/impact/page.tsx`. The two must match
or the composite is ignored and single tiles are drawn instead.

## Individual goal icons (optional)

If you would rather have one file per goal, drop the UN set in here and the
components will use it wherever a composite is missing:

    E-WEB-Goal-01.png     (the usual name in the UN zip)
    E_WEB_01.png
    sdg-01.png
    01.png

Download: https://www.un.org/sustainabledevelopment/news/communications-material/

## Fallback

With neither present, tiles render as the official colour, goal number and short
title — the right shape and palette, plainly not a reproduction of the mark.

The UN's usage guidelines come with the download: the icons may be used to
communicate about the goals, must not be altered, and must not imply UN
endorsement.
