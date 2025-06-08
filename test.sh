#!/bin/bash

# Function to check if three numbers form a Pythagorean triplet
is_pythagorean_triplet() {
    local a=$1
    local b=$2
    local c=$3
    if (( a * a + b * b == c * c )); then
        echo "$a $b $c" >> result.txt
    fi
}


# Find Pythagorean triplets
limit=1000  # Adjust this limit for higher numbers

# Only need to check up to sqrt(limit) for `a`
for (( a = 1; a * a <= limit; a++ )); do
    # Only need to check up to `a` for `b`
    for (( b = a; b <= a; b++ )); do
        # Calculate `c` directly
        c=$(echo "scale=0; sqrt($a * $a + $b * $b)" | bc)
        # Check if `c` is an integer
        if [ $c -eq $(echo "$c" | awk '{printf "%.0f\n", $0}') ]; then
            is_pythagorean_triplet $a $b $c
        fi
    done
done

