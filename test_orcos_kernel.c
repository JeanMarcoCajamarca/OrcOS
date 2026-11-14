/*
 * orcOS Kernel & Hardware Telemetry Verification Suite (C)
 * Tests core OS primitives: memory allocation, virtual filesystem path validation,
 * and System Health telemetry thresholds before final OS packaging.
 *
 * Compile & Run:
 *   gcc -Wall -Wextra -std=c11 test_orcos_kernel.c -o test_orcos_kernel && ./test_orcos_kernel
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <stdbool.h>

#define MAX_PATH_LEN 256
#define HORDE_GOAL_MAX 1000

typedef struct {
    float cpu_usage_pct;
    size_t ram_used_mb;
    size_t ram_total_mb;
    int horde_goal_progress;
} SystemHealth;

/* Validates File Realm virtual paths to prevent directory traversal attacks */
bool validate_file_realm_path(const char *path) {
    if (path == NULL || strlen(path) == 0 || strlen(path) >= MAX_PATH_LEN) {
        return false;
    }
    if (strstr(path, "..") != NULL) {
        return false; /* Block parent directory escape */
    }
    if (strncmp(path, "/FileRealm/", 11) != 0) {
        return false; /* Must reside inside File Realm root */
    }
    return true;
}

/* Simulates System Health calculation shown in future.png */
SystemHealth compute_system_health(float cpu, size_t used_ram, size_t total_ram, int goal) {
    SystemHealth health;
    health.cpu_usage_pct = (cpu < 0.0f) ? 0.0f : (cpu > 100.0f ? 100.0f : cpu);
    health.ram_total_mb = (total_ram == 0) ? 1024 : total_ram;
    health.ram_used_mb = (used_ram > health.ram_total_mb) ? health.ram_total_mb : used_ram;
    health.horde_goal_progress = (goal < 0) ? 0 : (goal > HORDE_GOAL_MAX ? HORDE_GOAL_MAX : goal);
    return health;
}

void test_memory_page_allocation(void) {
    printf("[TEST] Kernel Page Buffer Allocation... ");
    size_t buffer_size = 4096 * 16; /* 64 KB desktop compositor frame buffer */
    unsigned char *frame_buffer = (unsigned char *)calloc(buffer_size, sizeof(unsigned char));
    assert(frame_buffer != NULL);

    /* Write and verify magic bytes */
    frame_buffer[0] = 0x0C; /* orcOS signature */
    frame_buffer[buffer_size - 1] = 0x53;
    assert(frame_buffer[0] == 0x0C && frame_buffer[buffer_size - 1] == 0x53);

    free(frame_buffer);
    printf("PASSED\n");
}

void test_file_realm_security(void) {
    printf("[TEST] File Realm Path Sandboxing... ");
    assert(validate_file_realm_path("/FileRealm/Orcs/roster.dat") == true);
    assert(validate_file_realm_path("/FileRealm/Loot/legendary_sword.item") == true);
    assert(validate_file_realm_path("/FileRealm/../etc/shadow") == false);
    assert(validate_file_realm_path("/root/secret") == false);
    assert(validate_file_realm_path("") == false);
    printf("PASSED\n");
}

void test_system_health_telemetry(void) {
    printf("[TEST] System Health & Horde-Goal Telemetry... ");
    SystemHealth h = compute_system_health(42.5f, 4096, 16384, 683);
    assert(h.cpu_usage_pct == 42.5f);
    assert(h.ram_used_mb == 4096);
    assert(h.horde_goal_progress == 683);

    /* Boundary clamping check */
    SystemHealth overflow = compute_system_health(150.0f, 32000, 16384, 1500);
    assert(overflow.cpu_usage_pct == 100.0f);
    assert(overflow.ram_used_mb == 16384);
    assert(overflow.horde_goal_progress == HORDE_GOAL_MAX);
    printf("PASSED\n");
}

int main(void) {
    printf("=== orcOS Kernel & Low-Level C Test Suite ===\n");
    test_memory_page_allocation();
    test_file_realm_security();
    test_system_health_telemetry();
    printf("All C kernel & system tests PASSED!\n");
    return 0;
}
